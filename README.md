# alosaur
alosaur - deno web framework 🦖
---

# TODO

* [x] Add render views: [dejs](https://github.com/syumai/dejs)
* [x] Add return value JSON
* Add decorators:
* * [x] `@Area`
* * [x] `@QueryParam`
* * [x] `@Param` param from url: `/:id`
* * [x] `@Body`
* * [x] `@Cookie`
* * [x] `@Req`
* * [x] `@Res`
* * [x] `@Middleware` with regex route
* * [ ] `@Cache` Cache to actions {duration: number} number in ms
* [x] Add middleware
* [x] Add static middleware (example: app.useStatic)
* [ ] Add CORS middleware 
```ts
app.useCors(builder => builder.WithOrigins("http://localhost:8000")
                            .AllowAnyHeader()
                            .AllowAnyMethod());
```
* [ ] Add websockets
* [x] Add DI
* [ ] Add std exception filters
* [ ] Add validators
* [ ] Add microservice connector with wasm
* [ ] Add benchmarks
* [ ] Add docs and more examples ;)


## Plugins & modules

* [ ] Add angular template parser
* [ ] Add CLI with schematics (alosaur/cli)
* [ ] Add validator decorators
* [ ] Add porting TypeORM to deno

## Examples

* [x] Add basic example
* [x] Add di example
* [x] Add static serve example
* [x] Add dejs view render example
* [x] Add example with sql drivers (postgres)
* [ ] Add example with wasm
* [ ] Add basic example in Docker container 