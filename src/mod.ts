import { MetadataArgsStorage } from "./metadata/metadata.ts";
import { HTTPOptions, serve, Server } from "./deps.ts";
import { StaticFilesConfig } from "./models/static-config.ts";
import { ViewRenderConfig } from "./models/view-render-config.ts";
import { CorsBuilder } from "./middlewares/cors-builder.ts";
import { RouteMetadata } from "./metadata/route.ts";
import { registerAreas } from "./utils/register-areas.ts";
import { registerControllers } from "./utils/register-controllers.ts";
import { IMiddleware } from "./models/middleware-target.ts";
import {
  TransformConfig,
  TransformConfigMap,
} from "./models/transform-config.ts";

import { Context } from "./models/context.ts";
import { AppSettings } from "./models/app-settings.ts";
import { container as defaultContainer } from "./injection/index.ts";
import { MiddlewareMetadataArgs } from "./metadata/middleware.ts";
import { registerAppProviders } from "./utils/register-providers.ts";
import { handleFullServer, handleLiteServer } from "./server/handle-request.ts";
import { handleNativeServer } from "./server/handle-native-request.ts";

export type ObjectKeyAny = { [key: string]: any };

const global: ObjectKeyAny = {};

export function getMetadataArgsStorage<TState>(): MetadataArgsStorage<TState> {
  if (!(global as any).routingControllersMetadataArgsStorage) {
    (global as any).routingControllersMetadataArgsStorage =
      new MetadataArgsStorage();
  }

  return (global as any).routingControllersMetadataArgsStorage;
}

export function clearMetadataArgsStorage(): void {
  if ((global as any).routingControllersMetadataArgsStorage) {
    (global as any).routingControllersMetadataArgsStorage = null;
  }
}

export function getViewRenderConfig(): ViewRenderConfig {
  return (global as any).viewRenderConfig;
}

export class App<TState> {
  public get staticConfig(): StaticFilesConfig | undefined {
    return this._staticConfig;
  }
  private _staticConfig?: StaticFilesConfig;

  public get transformConfigMap(): TransformConfigMap | undefined {
    return this._transformConfigMap;
  }
  public _transformConfigMap?: TransformConfigMap;

  public get globalErrorHandler():
    | ((ctx: Context<TState>, error: Error) => void)
    | undefined {
    return this._globalErrorHandler;
  }
  private _globalErrorHandler?: (ctx: Context<TState>, error: Error) => void;

  public get routes(): RouteMetadata[] {
    return this._routes;
  }
  private _routes: RouteMetadata[] = [];

  private readonly metadata: MetadataArgsStorage<TState>;
  private classes: ObjectKeyAny[] = [];

  private viewRenderConfig: ViewRenderConfig | undefined = undefined;

  private server: Server | undefined = undefined;

  constructor(private readonly settings: AppSettings) {
    this.metadata = getMetadataArgsStorage();

    this.metadata.container = settings.container || defaultContainer;

    this.sortMiddlewares(settings);

    registerAppProviders(settings, this.metadata.container);

    registerAreas(this.metadata);
    registerControllers(
      this.metadata,
      this.classes,
      (route) => this._routes.push(route),
      settings.logging,
    );

    this.useStatic(settings.staticConfig);
    this.useViewRender(settings.viewRenderConfig);
  }

  // Sort middlewares by app settings
  private sortMiddlewares(settings: AppSettings) {
    if (settings.middlewares) {
      let middlewares: MiddlewareMetadataArgs<TState>[] = [];

      for (let middleware of settings.middlewares) {
        middlewares.push(
          this.metadata.middlewares.find((m) =>
            m.object === middleware
          ) as MiddlewareMetadataArgs<TState>,
        );
      }
      this.metadata.middlewares = middlewares;
    }
  }

  async listen(
    addr: string | HTTPOptions = ":8000",
    customListener?: Deno.Listener,
  ): Promise<any> {
    if (typeof addr === "string") {
      addr = _parseAddrFromStr(addr);
    }

    const listener = customListener || Deno.listen(addr);

    console.log("Server start in", addr);

    if (customListener) {
      // Run deno/http
      await handleNativeServer(
        listener,
        this,
        this.metadata,
        this.isRunFullServer(),
      );
    } else {
      // Run std/http
      const server = new Server(listener);
      this.server = server;

      if (this.isRunFullServer()) {
        await handleFullServer(server, this.metadata, this);
      } else {
        await handleLiteServer(server, this);
      }
    }

    return;
  }

  private isRunFullServer(): boolean {
    return !!(this.metadata.hooks.length > 0 ||
      this.metadata.middlewares.length > 0 ||
      this.settings.providers && this.settings.providers.length > 0 ||
      this.settings.container);
  }

  public close(): void {
    if (this.server) {
      this.server.close();
    } else {
      console.warn("Server is not listening");
    }
  }

  public useStatic(config?: StaticFilesConfig): void {
    if (config && !this._staticConfig) {
      this._staticConfig = config;
    }
  }

  public useViewRender(config?: ViewRenderConfig): void {
    if (config && !this.viewRenderConfig) {
      this.viewRenderConfig = config;
      (global as any).viewRenderConfig = config;
    }
  }

  public useTransform(transform: TransformConfig): void {
    if (!this._transformConfigMap) {
      this._transformConfigMap = new Map();
    }

    this._transformConfigMap.set(transform.type, transform);
  }

  /**
  * Deprecate
  */
  public useCors(builder: CorsBuilder<TState>): void {
    this.metadata.middlewares.push({
      type: "middleware",
      target: builder,
      object: builder,
      route: /\//,
    });
  }

  public use(route: RegExp, middleware: IMiddleware<TState>): void {
    this.metadata.middlewares.push({
      type: "middleware",
      target: middleware,
      object: middleware,
      route,
    });
  }

  /**
   * Create one global error handler
   */
  public error(
    globalErrorHandler: (ctx: Context<TState>, error: Error) => void,
  ): void {
    this._globalErrorHandler = globalErrorHandler;
  }
}

// from std/http
/**
 * Parse addr from string
 *
 *     const addr = "::1:8000";
 *     parseAddrFromString(addr);
 *
 * @param addr Address string
 */
export function _parseAddrFromStr(addr: string): HTTPOptions {
  let url: URL;
  try {
    const host = addr.startsWith(":") ? `0.0.0.0${addr}` : addr;
    url = new URL(`http://${host}`);
  } catch {
    throw new TypeError("Invalid address.");
  }
  if (
    url.username ||
    url.password ||
    url.pathname != "/" ||
    url.search ||
    url.hash
  ) {
    throw new TypeError("Invalid address.");
  }

  return {
    hostname: url.hostname,
    port: url.port === "" ? 80 : Number(url.port),
  };
}
