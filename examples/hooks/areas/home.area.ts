import { Area, Controller, Get, Res } from '../../../mod.ts';
import { UseHook } from '../../../src/decorator/UseHook.ts';
import { BadRequestError } from '../../../src/http-error/BadRequestError.ts';

import { TokenHook } from '../hooks/token-hook.ts';
import { CatchHook } from '../hooks/catch-hook.ts';

@Controller()
export class HomeController {

    @UseHook(TokenHook, '123')
    @Get('/')
    text(@Res() res: any) {
        return ``;
    }

    @UseHook(TokenHook, '123')
    @Get('/error')
    geterror() {
        throw new BadRequestError();
    }

    @UseHook(CatchHook)
    @Get('/error-hook')
    geterrorhook() {
        throw new BadRequestError();
    }
}

@Area({
    controllers: [HomeController],
})
export class HomeArea {}