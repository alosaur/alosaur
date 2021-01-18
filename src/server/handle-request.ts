import { Server } from "../deps.ts";
import { SERVER_REQUEST } from "../models/tokens.model.ts";
import { Context } from "../models/context.ts";
import { getStaticFile } from "../utils/get-static-file.ts";
import { getAction } from "../route/get-action.ts";
import { getHooksFromAction } from "../route/get-hooks.ts";
import { hasHooks, hasHooksAction, resolveHooks } from "../utils/hook.utils.ts";
import { getActionParams } from "../route/get-action-params.ts";
import { notFoundAction } from "../renderer/not-found.ts";
import { HttpError } from "../http-error/HttpError.ts";
import { Content } from "../renderer/content.ts";
import { App } from "../mod.ts";
import { MiddlewareMetadataArgs } from "../metadata/middleware.ts";
import { MetadataArgsStorage } from "../metadata/metadata.ts";

// Get middlewares in request
function getMiddlwareByUrl<T>(
  middlewares: MiddlewareMetadataArgs<T>[],
  url: string,
): any[] {
  if (middlewares.length === 0) return []; // for perf optimization
  return middlewares.filter((m) => m.route.test(url));
}

export async function handleFullServer<TState>(
  server: Server,
  metadata: MetadataArgsStorage<TState>,
  app: App<TState>,
) {
  for await (const req of server) {
    metadata.container.register(SERVER_REQUEST, { useValue: req });
    const context = metadata.container.resolve<Context<TState>>(Context);

    try {
      const middlewares = getMiddlwareByUrl(
        metadata.middlewares,
        context.request.url,
      );

      // Resolve every pre middleware
      for (const middleware of middlewares) {
        await middleware.target.onPreRequest(context);
      }

      if (context.response.isNotRespond()) {
        continue;
      }

      if (context.response.isImmediately()) {
        req.respond(context.response.getRaw());
        continue;
      }

      // try getting static file
      if (
        app.staticConfig && await getStaticFile(context, app.staticConfig)
      ) {
        req.respond(context.response.getRaw());
        continue;
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
              req.respond(context.response.getMergedResult());
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
        req.respond(context.response.getMergedResult());
        continue;
      }

      // Resolve every post middleware
      for (const middleware of middlewares) {
        //@ts-ignore
        await middleware.target.onPostRequest(context);
      }

      if (context.response.isImmediately()) {
        req.respond(context.response.getMergedResult());
        continue;
      }

      if (context.response.result === undefined) {
        context.response.result = notFoundAction();

        req.respond(context.response.getMergedResult());
        continue;
      }

      req.respond(context.response.getMergedResult());
    } catch (error) {
      if (app.globalErrorHandler) {
        app.globalErrorHandler(context, error);

        if (context.response.isImmediately()) {
          req.respond(context.response.getMergedResult());
          continue;
        }
      }

      if (context.response.isImmediately()) {
        req.respond(context.response.getMergedResult());
        continue;
      }

      if (!(error instanceof HttpError)) {
        console.error(error);
      }

      req.respond(Content(error, error.httpCode || 500));
    }
  }
}

// TODO make 1 function
export async function handleLiteServer<TState>(
  server: Server,
  app: App<TState>,
) {
  for await (const req of server) {
    const context = new Context(req);

    try {
      // try getting static file
      if (
        app.staticConfig && await getStaticFile(context, app.staticConfig)
      ) {
        req.respond(context.response.getRaw());
        continue;
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

        req.respond(context.response.getMergedResult());
        continue;
      }

      req.respond(context.response.getMergedResult());
    } catch (error) {
      if (app.globalErrorHandler) {
        app.globalErrorHandler(context, error);

        if (context.response.isImmediately()) {
          req.respond(context.response.getMergedResult());
          continue;
        }
      }

      if (context.response.isImmediately()) {
        req.respond(context.response.getMergedResult());
        continue;
      }

      if (!(error instanceof HttpError)) {
        console.error(error);
      }

      req.respond(Content(error, error.httpCode || 500));
    }
  }
}
