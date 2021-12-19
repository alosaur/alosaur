import { App } from "../mod.ts";
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
import { ActionResult } from "../models/response.ts";
import { HttpContext } from "../models/http-context.ts";
import {
  Handler,
  serveListener,
} from "https://deno.land/std@0.117.0/http/server.ts";

// Get middlewares in request
function getMiddlwareByUrl<T>(
  middlewares: MiddlewareMetadataArgs<T>[],
  url: string,
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
) {
  if (runFullServer) {
    // for await (const conn of listener) {
    //   // handleFullServer(conn, app, metadata);
    // }
  } else {
    // for await (const conn of listener) {
    serveListener(listener, handleLiteServer(app));
    // }
  }
}

function handleFullServer<TState>(
  conn: Deno.Conn,
  app: App<TState>,
  metadata: MetadataArgsStorage<TState>,
): Handler {
  return async function (request, connInfo) {

    metadata.container.register(SERVER_REQUEST, { useValue: request });
    const context = metadata.container.resolve<HttpContext<TState>>(
      HttpContext,
    );

    try {
      const middlewares = getMiddlwareByUrl(
        metadata.middlewares,
        context.request.parserUrl.pathname,
      );

      // Resolve every pre middleware
      for (const middleware of middlewares) {
        await middleware.target.onPreRequest(context);
      }

      if (context.response.isNotRespond()) {
        // not respond
        // continue;
      }

      if (context.response.isImmediately()) {
        return getResponse({ body: context.response.getRaw() } as ActionResult);
      }

      // try getting static file
      if (
        app.staticConfig && await getStaticFile(context, app.staticConfig)
      ) {
        return getResponse(context.response.getRaw() as ActionResult);
      }

      const action = getAction(
        app.routes,
        context.request.method,
        context.request.url,
      );

      if (action !== null) {
        const hooks = getHooksFromAction(action);

        // try resolve hooks
        if (
          hasHooks(hooks) && await resolveHooks(context, "onPreAction", hooks)
        ) {
          continue;
        }

        // Get arguments in this action
        const args = await getActionParams(
          context,
          action,
          app.transformConfigMap,
        );

        try {
          // Get Action result from controller method
          context.response.result = await action.target[action.action](
            ...args,
          );
        } catch (error) {
          context.response.error = error;

          // try resolve hooks
          if (
            hasHooks(hooks) &&
            hasHooksAction("onCatchAction", hooks) &&
            await resolveHooks(context, "onCatchAction", hooks)
          ) {
            continue;
          } else {
            // Resolve every post middleware if error was not caught
            for (const middleware of middlewares) {
              //@ts-ignore
              await middleware.target.onPostRequest(context);
            }

            if (context.response.isImmediately()) {
              respondWith(getResponse(context.response.getMergedResult()));
              continue;
            }

            throw error;
          }
        }

        // try resolve hooks
        if (
          hasHooks(hooks) &&
          await resolveHooks(context, "onPostAction", hooks)
        ) {
          continue;
        }
      }

      if (context.response.isImmediately()) {
        respondWith(getResponse(context.response.getMergedResult()));
        continue;
      }

      // Resolve every post middleware
      for (const middleware of middlewares) {
        //@ts-ignore
        await middleware.target.onPostRequest(context);
      }

      if (context.response.isImmediately()) {
        respondWith(getResponse(context.response.getMergedResult()));
        continue;
      }

      if (context.response.result === undefined) {
        context.response.result = notFoundAction();

        respondWith(getResponse(context.response.getMergedResult()));
        continue;
      }

      respondWith(getResponse(context.response.getMergedResult()));
    } catch (error) {
      if (app.globalErrorHandler) {
        app.globalErrorHandler(context, error);

        if (context.response.isImmediately()) {
          respondWith(getResponse(context.response.getMergedResult()));
          continue;
        }
      }

      if (context.response.isImmediately()) {
        respondWith(getResponse(context.response.getMergedResult()));
        continue;
      }

      if (!(error instanceof HttpError)) {
        console.error(error);
      }

      respondWith(getResponse(Content(error, error.httpCode || 500)));
    }
  }
}

function handleLiteServer<TState>(app: App<TState>): Handler {
  return async function (request, connInfo) {
    const context = new HttpContext(request);

    try {
      // try getting static file
      if (
        app.staticConfig && await getStaticFile(context, app.staticConfig)
      ) {
        return getResponse(context.response.getRaw() as ActionResult);
      }

      const action = getAction(
        app.routes,
        context.request.method,
        context.request.url,
      );

      if (action !== null) {
        // Get arguments in this action
        const args = await getActionParams(
          context,
          action,
          app.transformConfigMap,
        );

        // Get Action result from controller method
        context.response.result = await action.target[action.action](
          ...args,
        );
      }

      if (context.response.result === undefined) {
        context.response.result = notFoundAction();

        return getResponse(context.response.getMergedResult());
      }

      return getResponse(context.response.getMergedResult());
    } catch (error) {
      if (app.globalErrorHandler) {
        app.globalErrorHandler(context, error);

        if (context.response.isImmediately()) {
          return getResponse(context.response.getMergedResult());
        }
      }

      if (context.response.isImmediately()) {
        return getResponse(context.response.getMergedResult());
      }

      if (!(error instanceof HttpError)) {
        console.error(error);
      }

      return getResponse(Content(error, error.httpCode || 500));
    }
  };
}

function getResponse(result: ActionResult): Response {
  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  });
}
