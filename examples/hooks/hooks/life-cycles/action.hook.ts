import { HookTarget } from "../../../../src/models/hook.ts";
import { Context } from '../../../../src/models/context.ts';

export class ActionHook implements HookTarget<unknown, any> {
    async onPostAction(context: Context<unknown>, payload: any) {
        context.response.result!.fromActionPreHook = true;
        context.response.result!.count += 1;
    };

    async onCatchAction(context: Context<unknown>, payload: any) {
        console.log("ActionHook: onCatchAction");
    };
}