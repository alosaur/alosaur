Start server:

```
deno run -A --config ./src/tsconfig.lib.json examples/validator/app.ts
```

Request POST data

```js
curl -X POST \
  http://localhost:8000/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"title": "First post",
	"text": "hello!",
	"rating": 5
}'
```

Response:

```js
{
    "data": {
        "title": "First post",
        "text": "hello!",
        "rating": 5
    },
    "errors": [
        {
            "target": {
                "title": "First post",
                "text": "hello!",
                "rating": 5
            },
            "property": "email",
            "children": [],
            "constraints": {
                "isEmail": "email must be an email"
            }
        }
    ]
}
```

Request POST data

```js
curl -X POST \
  http://localhost:8000/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"title": "First post",
	"text": "hello!",
	"rating": 5,
	"email": "mail@gmail.com"
}'
```

Response:

```js
{
    "data": {
        "title": "First post",
        "text": "hello!",
        "rating": 5,
        "email": "mail@gmail.com"
    },
    "errors": []
}
```
