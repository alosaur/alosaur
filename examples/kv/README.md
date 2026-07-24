## Alosaur with Deno KV

This example demonstrates a simple CRUD REST API using [Deno KV](https://deno.com/kv) as the storage backend.

Deno KV is a built-in key-value store available in Deno — no external database or Docker setup required.

### Endpoints

| Method | Path              | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/products`       | List all products    |
| GET    | `/products/:id`   | Get product by ID    |
| POST   | `/products`       | Create a new product |
| PUT    | `/products/:id`   | Update a product     |
| DELETE | `/products/:id`   | Delete a product     |

### How to start

Run the application:

```sh
deno run --allow-net --allow-read --allow-write --allow-env --unstable-kv examples/kv/app.ts
```

### Example requests

Create a product:

```sh
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","price":9.99}'
```

List all products:

```sh
curl http://localhost:8000/products
```

Update a product (replace `<id>` with the actual product ID):

```sh
curl -X PUT http://localhost:8000/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"price":12.99}'
```

Delete a product:

```sh
curl -X DELETE http://localhost:8000/products/<id>
```
