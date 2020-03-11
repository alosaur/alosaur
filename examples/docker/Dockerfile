FROM maxmcd/deno:jessie-v0.35.0

# Create app directory
WORKDIR /usr/src/app

COPY . .

EXPOSE 8000

CMD [ "deno", "run", "-r", "-A", "--config", "./tsconfig.app.json", "./app.ts" ]