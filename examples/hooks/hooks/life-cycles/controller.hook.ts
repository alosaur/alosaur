import { HookTarget } from "../../../../src/models/hook.ts";
import { Context } from '../../../../src/models/context.ts';

export class ControllerHook implements HookTarget<unknown, any> {
    async onPostAction(context: Context<unknown>, payload: any) {
        context.response.result!.fromControllerPreHook = true;
        context.response.result!.count += 1;
    };
}