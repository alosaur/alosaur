import { App, CloseResourceLike } from "../mod.ts";
import { getAction } from "../route/get-action.ts";
import { getActionParams } from "../route/get-action-params.ts";
import { MetadataArgsStorage } from "../metadata/metadata.ts";
import { SERVER_REQUEST } from "../models/tokens.model.ts";
import { getStaticFile } from "../utils/get-static-file.ts";
import { getHooksFromAction } from "../route/get-hooks.ts";
import { hasHooks, hasHooksAction, resolveHooks } from "../utils/hook.utils.ts";
import { notFoundAction } from "../renderer/not-found.ts";
import { HttpError } from "../http-error/HttpError.ts";
import { Content } from "../renderer/content.ts";
import { MiddlewareMetadataArgs } from "../metadata/middleware.ts";
import { PrimitiveResponse } from "../models/response.ts";
import { HttpContext } from "../models/http-context.ts";

type HttpConn = Deno.HttpConn & { managedResources: Set<number> };

const isConn = (conn: unknown): conn is Deno.Conn => {
  return (
    typeof conn === "object" &&
    (<Record<string, unknown>>conn)?.rid !== undefined &&
    (<Record<string, unknown>>conn)?.localAddr !== undefined &&
    (<Record<string, unknown>>conn)?.remoteAddr !== undefined &&
    (<Record<string, unknown>>conn)?.readable !== undefined &&
    (<Record<string, unknown>>conn)?.writable !== undefined &&
    (<Record<string, unknown>>conn)?.closeWrite !== undefined
  );
};

const isHttpConn = (conn: unknown): conn is HttpConn => {
  return (
    typeof conn === "object" &&
    (<Record<string, unknown>>conn)?.managedResources !== undefined
  );
};

// Get middlewares in request
function getMiddlwareByUrl<T>(
  middlewares: MiddlewareMetadataArgs<T>[],
  url: string
): any[] {
  if (middlewares.length === 0) return []; // for perf optimization
  return middlewares.filter((m) => m.route.test(url));
}

/**
 * Gets deno native http bindigs
 * lite server without: static config, catch requests
 */
export async function handleNativeServer<TState>(
  listener: Deno.Listener,
  app: App<TState>,
  metadata: MetadataArgsStorage<TState>,
  runFullServer: boolean,
  resources: CloseResourceLike[]
) {
  for await (const conn of listener) {
    handleServerRequest(conn, app, metadata, runFullServer, resources);
    captureResources(resources, conn);
  }
}

function respondWithWrapper(
  respondWith: (r: Response | Promise<Response>) => Promise<void>,
  conn: Deno.Conn
): (r: Response | Promise<Response>) => Promise<void> {
  return (res: Response | Promise<Response>) =>
    respondWith(res).catch(() => {
      // respondWith() fails when the connection has already been closed, or there is some
      // other error with responding on this connection that prompts us to
      // close it and open a new connection.
      try {
        conn.close();
      } catch {
        // Connection has already been closed.
      }
    });
}

function captureResources(
  resources: CloseResourceLike[],
  connection: Deno.Conn | HttpConn
) {
  if (isConn(connection)) {
    resources.push(connection.close.bind(connection));
  }

  if (isHttpConn(connection)) {
    const poppedRequest = connection.managedResources.values().next();

    if (!resources.includes(connection.close.bind(connection))) {
      resources.push(connection.close.bind(connection));
    }

    if (
      !poppedRequest.done &&
      connection.managedResources.delete(poppedRequest.value)
    ) {
      resources.push(() => Deno.close(poppedRequest.value));
    }
  }
}

async function handleServerRequest<TState>(
  conn: Deno.Conn,
  app: App<TState>,
  metadata: MetadataArgsStorage<TState>,
  runFullServer: boolean,
  resources: CloseResourceLike[]
) {
  const requests = Deno.serveHttp(conn);

  for await (const request of requests) {
    if (runFullServer) {
      handleFullServerRequest(conn, app, metadata, request);
    } else {
      handleLiteServerRequest(conn, app, request);
    }

    captureResources(resources, <HttpConn>requests);
  }
}

async function handleFullServerRequest<TState>(
  conn: Deno.Conn,
  app: App<TState>,
  metadata: MetadataArgsStorage<TState>,
  request: Deno.RequestEvent
) {
  const respondWith = respondWithWrapper(request.respondWith, conn);

  metadata.container.register(SERVER_REQUEST, { useValue: request });
  const context = metadata.container.resolve<HttpContext<TState>>(HttpContext);

  try {
    const middlewares = getMiddlwareByUrl(
      metadata.middlewares,
      context.request.parserUrl.pathname
    );

    // Resolve every pre middleware
    for (const middleware of middlewares) {
      await middleware.target.onPreRequest(context);
    }

    if (context.response.isNotRespond()) {
      return;
    }

    if (context.response.isImmediately()) {
      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    // try getting static file
    if (app.staticConfig && (await getStaticFile(context, app.staticConfig))) {
      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    const action = getAction(
      app.routes,
      context.request.method,
      context.request.url
    );

    if (action !== null) {
      const hooks = getHooksFromAction(action);

      // try resolve hooks
      if (
        hasHooks(hooks) &&
        (await resolveHooks(context, "onPreAction", hooks))
      ) {
        return;
      }

      // Get arguments in this action
      const args = await getActionParams(
        context,
        action,
        app.transformConfigMap
      );

      try {
        // Get Action result from controller method
        context.response.result = await action.target[action.action](...args);
      } catch (error) {
        context.response.error = error;

        // try resolve hooks
        if (
          hasHooks(hooks) &&
          hasHooksAction("onCatchAction", hooks) &&
          (await resolveHooks(context, "onCatchAction", hooks))
        ) {
          return;
        } else {
          // Resolve every post middleware if error was not caught
          for (const middleware of middlewares) {
            //@ts-ignore
            await middleware.target.onPostRequest(context);
          }

          if (context.response.isImmediately()) {
            await respondWith(getResponse(context.response.getMergedResult()));
            return;
          }

          throw error;
        }
      }

      // try resolve hooks
      if (
        hasHooks(hooks) &&
        (await resolveHooks(context, "onPostAction", hooks))
      ) {
        return;
      }
    }

    if (context.response.isImmediately()) {
      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    // Resolve every post middleware
    for (const middleware of middlewares) {
      //@ts-ignore
      await middleware.target.onPostRequest(context);
    }

    if (context.response.isImmediately()) {
      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    if (context.response.result === undefined) {
      context.response.result = notFoundAction();

      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    await respondWith(getResponse(context.response.getMergedResult()));
  } catch (error) {
    if (app.globalErrorHandler) {
      app.globalErrorHandler(context, error);

      if (context.response.isImmediately()) {
        await respondWith(getResponse(context.response.getMergedResult()));
        return;
      }
    }

    if (context.response.isImmediately()) {
      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    if (!(error instanceof HttpError)) {
      console.error(error);
    }

    await respondWith(getResponse(Content(error, error.httpCode || 500)));
  }
}

async function handleLiteServerRequest<TState>(
  conn: Deno.Conn,
  app: App<TState>,
  request: Deno.RequestEvent
) {
  const respondWith = respondWithWrapper(request.respondWith, conn);

  const context = new HttpContext(request);

  try {
    // try getting static file
    if (app.staticConfig && (await getStaticFile(context, app.staticConfig))) {
      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    const action = getAction(
      app.routes,
      context.request.method,
      context.request.url
    );

    if (action !== null) {
      // Get arguments in this action
      const args = await getActionParams(
        context,
        action,
        app.transformConfigMap
      );

      // Get Action result from controller method
      context.response.result = await action.target[action.action](...args);
    }

    if (context.response.result === undefined) {
      context.response.result = notFoundAction();

      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    await respondWith(getResponse(context.response.getMergedResult()));
  } catch (error) {
    if (app.globalErrorHandler) {
      app.globalErrorHandler(context, error);

      if (context.response.isImmediately()) {
        await respondWith(getResponse(context.response.getMergedResult()));
        return;
      }
    }

    if (context.response.isImmediately()) {
      await respondWith(getResponse(context.response.getMergedResult()));
      return;
    }

    if (!(error instanceof HttpError)) {
      console.error(error);
    }

    await respondWith(getResponse(Content(error, error.httpCode || 500)));
  }
}

function getResponse(result: Response | PrimitiveResponse): Response {
  if (result instanceof Response) {
    return result;
  }

  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  });
}
