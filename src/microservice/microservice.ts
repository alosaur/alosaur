import { TcpContext, TcpServer, TcpServerConfig } from "./server/server.ts";
import { registerAreas } from "../utils/register-areas.ts";
import { MetadataArgsStorage } from "../metadata/metadata.ts";
import { container as defaultContainer, DependencyContainer } from "../injection/index.ts";
import { getMetadataArgsStorage, ObjectKeyAny } from "../mod.ts";
import { registerAppProviders } from "../utils/register-providers.ts";
import { ProviderDeclaration } from "../types/provider-declaration.ts";
import { registerControllers } from "../utils/register-controllers.ts";
import { RouteMetadata } from "../metadata/route.ts";
import { getHooksFromAction } from "../route/get-hooks.ts";
import { hasHooks, hasHooksAction, resolveHooks } from "../utils/hook.utils.ts";
import { getMsActionParams } from "../route/get-action-params.ts";
import { RequestMethod } from "../types/request-method.ts";

export enum MicroserviceType {
  TCP,
}

export interface MicroserviceSettings {
  areas: Function[];
  type: MicroserviceType;
  config: TcpServerConfig;

  /**
   * Custom DI container
   */
  container?: DependencyContainer;

  /**
   * Providers declared in microservice
   */
  providers?: ProviderDeclaration[];
}

export class Microservice<TState> {
  private readonly metadata: MetadataArgsStorage<TState>;
  private readonly server: TcpServer;
  private readonly classes: ObjectKeyAny[] = [];
  private readonly actions: RouteMetadata[] = [];
  private readonly delimeter = "#";
  private readonly endOfMessage = "\n";

  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();

  constructor(settings: MicroserviceSettings) {
    this.metadata = getMetadataArgsStorage();

    this.metadata.container = settings.container || defaultContainer;

    // Register all areas routes
    registerAppProviders(settings, this.metadata.container);
    registerAreas(this.metadata);

    // Register actions
    registerControllers(
      this.metadata,
      this.classes,
      (route) => this.actions.push(route),
      false,
    );

    // TODO need context by Microservice type
    // create server, TCP by default
    this.server = new TcpServer(settings.config);
  }

  public async listen() {
    // listen server and run actions by event
    console.log("Start listen");
    return this.server.listen((rid: number, r: BufferSource) => this.handler(rid, r));
  }

  private async handler(rid: number, r: BufferSource) {
    // TODO need context by Microservice type
    const context = new TcpContext();

    const req = this.decoder.decode(r);
    const [pattern, data] = req.split(this.delimeter);

    // Gets only one action
    const action: RouteMetadata | undefined = this.actions.find((action) => action.eventOrPattern === pattern);

    let actionResult;

    if (action) {
      const hooks = getHooksFromAction(action);

      // try resolve onPreAction hooks
      if (
        hasHooks(hooks) && await resolveHooks(context, "onPreAction", hooks)
      ) {
        // TODO may be run respond to reader?
        return;
      }

      let body = {};
      try {
        body = JSON.parse(data);
      } catch {}

      // Get arguments in this action
      const args = await getMsActionParams(
        context,
        action,
        body,
      );

      try {
        // Get Action result from controller method
        actionResult = JSON.stringify(
          await action.target[action.action](...args),
        );
        const response = this.encoder.encode(
          pattern + this.delimeter + actionResult + this.endOfMessage,
        );

        if (action.actionMetadata.type === RequestMethod.Pattern) {
          await this.server.send(rid, response);
        }
      } catch (error) {
        context.response.error = error;

        // try resolve hooks
        if (
          hasHooks(hooks) &&
          hasHooksAction("onCatchAction", hooks) &&
          await resolveHooks(context, "onCatchAction", hooks)
        ) {
          // TODO may be run respond to reader?
          return;
        }
      }

      // try resolve hooks
      if (
        hasHooks(hooks) && await resolveHooks(context, "onPostAction", hooks)
      ) {
        // TODO may be run respond to reader?
        return;
      }
    }
  }
}
