import { Area, Controller, Get, QueryParam, Res } from '../../../src/mod.ts';
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
    geterror(@QueryParam('name') name: string) {
        throw new BadRequestError();
    }

    @UseHook(CatchHook)
    @Get('/error-hook')
    geterrorhook(@QueryParam('name') name: string) {
        throw new BadRequestError();
    }
}

@Area({
    controllers: [HomeController],
})
export class HomeArea {}