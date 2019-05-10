## Controller

```typescript
import { Controller, Content, Get } from 'https://deno.land/x/alosaur/mod.ts'

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