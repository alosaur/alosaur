import { Area, Controller, Get, Post, Body } from '../../../mod.ts';
import { UseHook } from '../../../src/decorator/UseHook.ts';
import { BadRequestError } from '../../../src/http-error/BadRequestError.ts';

import { TokenHook } from '../hooks/token-hook.ts';
import { CatchHook } from '../hooks/catch-hook.ts';
import { PreHook } from '../hooks/pre-hook.ts';
import { AsyncPreHook } from '../hooks/async-pre-hook.ts';
import { PostHook } from '../hooks/post-hook.ts';

@Controller()
export class HomeController {

    @Get('/')
    text() {
        return `main page`;
    }

    @UseHook(AsyncPreHook)
    @Get('/await')
    awaitText() {
        return `await page`;
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

    @UseHook(PostHook)
    @Post('/post-hook')
    getposthook(@Body() body: any) {        
        return body;
    }
}

@Area({
    controllers: [HomeController],
})
export class HomeArea { }