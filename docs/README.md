# Examples



## Simple example:

Controller:
```typescript

import { Controller, Content, Get } from 'https://deno.land/x/alosaur/mod.ts';

@Controller('/home')
export class HomeController {
  @Get('/text')
  text() {
    return Content("Hello world");
  }
  @Get('/json')
  json() {
    return Content({"text":"test"});
  }
}
```

Area:
```ts
import { Area } from 'https://deno.land/x/alosaur/mod.ts';
// Area without route params
@Area({
  controllers: [HomeController]
})
export class HomeArea {
}

```


Main app:
```ts
import { App } from 'https://deno.land/x/alosaur/mod.ts'

const app = new App({
  areas: [HomeArea]
});

app.listen();

```