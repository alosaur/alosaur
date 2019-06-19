FROM maxmcd/deno

# Create app directory
WORKDIR /usr/src/app

COPY . .

EXPOSE 8000

CMD [ "deno", "run", "-A", "--config", "./tsconfig.app.json", "./app.ts" ]