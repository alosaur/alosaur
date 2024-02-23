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
import { PrimitiveResponse } from "../models/response.ts";
import { HttpContext } from "../models/http-context.ts";

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
  listenOptions: Deno.ListenOptions,
  app: App<TState>,
  metadata: MetadataArgsStorage<TState>,
  runFullServer: boolean,
) {
  if (runFullServer) {
    // for await (const conn of listener) {
    handleFullServer(listenOptions, app, metadata);
    // }
  } else {
    // for await (const conn of listener) {
    handleLiteServer(listenOptions, app);
    // }
  }
}

async function handleFullServer<TState>(
  listenOptions: Deno.ListenOptions,
  app: App<TState>,
  metadata: MetadataArgsStorage<TState>,
) {
  Deno.serve(
    listenOptions,
    async (request) => {
      metadata.container.register(SERVER_REQUEST, request);
      const context = metadata.container.create<HttpContext<TState>>(
        HttpContext,
      );

      try {
        const middlewares = getMiddlwareByUrl(
          metadata.middlewares,
          context.request.parserUrl.pathname,
        );

        // Resolve every pre middleware
        for (const middleware of middlewares) {
          const response = await middleware.target.onPreRequest(context);

          if (response) {
            return response;
          }
        }

        if (context.response.isNotRespond()) {
          // continue;
          // nothing
        }

        if (context.response.isImmediately()) {
          return (
            getResponse(context.response.getMergedResult())
          );
          // continue;
        }

        // try getting static file
        if (
          app.staticConfig && await getStaticFile(context, app.staticConfig)
        ) {
          return (
            getResponse(context.response.getMergedResult())
          );
          // continue;
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
            // continue;
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
              // continue;
            } else {
              // Resolve every post middleware if error was not caught
              for (const middleware of middlewares) {
                //@ts-ignore
                await middleware.target.onPostRequest(context);
              }

              if (context.response.isImmediately()) {
                return (getResponse(context.response.getMergedResult()));
                // continue;
              }

              throw error;
            }
          }

          // try resolve hooks
          if (
            hasHooks(hooks) &&
            await resolveHooks(context, "onPostAction", hooks)
          ) {
            // continue;
          }
        }

        if (context.response.isImmediately()) {
          return (getResponse(context.response.getMergedResult()));
          // continue;
        }

        // Resolve every post middleware
        for (const middleware of middlewares) {
          //@ts-ignore
          await middleware.target.onPostRequest(context);
        }

        if (context.response.isImmediately()) {
          return (getResponse(context.response.getMergedResult()));
          // continue;
        }

        if (context.response.result === undefined) {
          context.response.result = notFoundAction();

          return (getResponse(context.response.getMergedResult()));
          // continue;
        }

        return (getResponse(context.response.getMergedResult()));
      } catch (error) {
        if (app.globalErrorHandler) {
          app.globalErrorHandler(context, error);

          if (context.response.isImmediately()) {
            return (getResponse(context.response.getMergedResult()));
            // continue;
          }
        }

        if (context.response.isImmediately()) {
          return (getResponse(context.response.getMergedResult()));
          // continue;
        }

        if (!(error instanceof HttpError)) {
          console.error(error);
        }

        return (getResponse(Content(error, error.httpCode || 500)));
      }
      // return new Response();
    },
  );
}

async function handleLiteServer<TState>(listenOptions: Deno.ListenOptions, app: App<TState>) {
  // const requests = Deno.serveHttp(conn);
  //
  // for await (const request of requests) {
  Deno.serve(
    listenOptions,
    async (request) => {
      // const respondWith = respondWithWrapper(request.respondWith, conn);

      const context = new HttpContext(request);

      try {
        // try getting static file
        if (
          app.staticConfig && await getStaticFile(context, app.staticConfig)
        ) {
          return (
            getResponse(context.response.getMergedResult())
          );
          // continue;
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

          return (getResponse(context.response.getMergedResult()));
          // continue;
        }

        return (getResponse(context.response.getMergedResult()));
      } catch (error) {
        if (app.globalErrorHandler) {
          app.globalErrorHandler(context, error);

          if (context.response.isImmediately()) {
            return (getResponse(context.response.getMergedResult()));
            // continue;
          }
        }

        if (context.response.isImmediately()) {
          return (getResponse(context.response.getMergedResult()));
          // continue;
        }

        if (!(error instanceof HttpError)) {
          console.error(error);
        }

        return (getResponse(Content(error, error.httpCode || 500)));
      }
    },
  );
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
