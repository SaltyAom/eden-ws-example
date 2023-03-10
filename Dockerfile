# ? -------------------------
FROM node:19.3.0 AS client

WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY client .

RUN pnpm i
RUN pnpm build

# ? -------------------------
FROM debian:11.6-slim AS server

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash

COPY server/package.json .
COPY server/bun.lockb .
COPY server/src src
COPY server/tsconfig.json .

RUN /root/.bun/bin/bun install --production

COPY --from=client /app/dist public

# ? -------------------------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=server /root/.bun/bin/bun bun
COPY --from=server /app/node_modules node_modules
COPY --from=server /app/public public
COPY --from=server /app/src src
COPY --from=server /app/tsconfig.json .

ENV ENV production
CMD ["./bun", "src/index.ts"]

EXPOSE 8080
