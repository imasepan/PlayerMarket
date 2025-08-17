FROM oven/bun:1.2.10

RUN apt-get update && apt-get install -y tini wget && apt-get clean

WORKDIR /app

COPY package.json tsconfig.json bun.lock .env ./
RUN bun install --frozen-lockfile
RUN bunx -y playwright@1.54.0 install --with-deps chromium

COPY ./src ./src

ENTRYPOINT ["/usr/bin/tini", "--", "bun", "run", "./src/index.ts"]