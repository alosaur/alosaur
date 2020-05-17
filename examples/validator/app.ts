import validator from "https://dev.jspm.io/class-validator@0.8.5";
import transformer from "https://dev.jspm.io/class-transformer@0.2.3";
import { App, Area, Controller, Get, Post, Body, QueryParam } from '../../src/mod.ts';
import { PostModel } from './models/post.ts';

const { validate } = validator;
const { plainToClass } = transformer;

@Controller()
export class HomeController {

    @Post('/')
    async post(@Body(PostModel) data: PostModel) {

        return {
            data,
            errors: await validate(data)
        }
    }

}

@Area({
    controllers: [HomeController],
})
export class HomeArea { }

const app = new App({
    areas: [HomeArea],
});

app.useTransform({
    type: 'body',
    getTransform: (transform: any, body: any) => {
        return plainToClass(transform, body);
    }
})

app.listen();
