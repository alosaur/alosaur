FROM maxmcd/deno:jessie-v1.0.0

# Create app directory
WORKDIR /usr/src/app

COPY . .

EXPOSE 8000

CMD [ "deno", "run", "-r", "-A", "--config", "./tsconfig.app.json", "./app.ts" ]