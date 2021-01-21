## alosaur with postgres

### How to start

Run postgres database

```sh
cd /examples/db

docker-compose up -d
```

Edit `database.ts` config

Run application

```
deno run -A --config ./src/tsconfig.lib.json examples/db/app.ts
```
