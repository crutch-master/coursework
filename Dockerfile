from oven/bun:1.2.10 as builder

workdir /build

copy . .

run bun install

env VITE_SERVER_URL="/trpc"
run bun --filter 'frontend' build
run bun --filter 'backend' build:docker

from oven/bun:1.2.10

workdir /app

run bun install --global dbmate

copy --from=builder /build/frontend/dist ./dist
copy --from=builder /build/backend/dist ./server
copy --from=builder /build/backend/db/migrations ./db/migrations

env NODE_ENV="production"
env DATABASE_URL="sqlite:db/database.sqlite3"
env SQLITE="db/database.sqlite3"

expose 3000

cmd ["bash", "-c", "dbmate up && bun run server/index.js"]
