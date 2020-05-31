import { Area, Controller, Get, Res } from '../../../mod.ts';
import { UseHook } from '../../../src/decorator/UseHook.ts';
import { BadRequestError } from '../../../src/http-error/BadRequestError.ts';

import { TokenHook } from '../hooks/token-hook.ts';
import { CatchHook } from '../hooks/catch-hook.ts';
import { PreHook } from '../hooks/pre-hook.ts';

@Controller()
export class HomeController {

    @Get('/')
    text(@Res() res: any) {
        return `main page`;
    }

    @UseHook(TokenHook, '123')
    @UseHook(PreHook)
    @Get('/many-hook-1')
    many1Hook() {
        return 'many hook 1 page';
    }

    @UseHook(PreHook)
    @UseHook(TokenHook, '123')
    @Get('/many-hook-2')
    many2Hook() {
        return 'many hook 2 page';
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