import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";
import makeLogger from "pino";
import { appRouter, type Context } from "./trpc/";
import { Database } from "bun:sqlite";
import path from "node:path";

// hate this thing
const cors = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization,  content-type",
} as const;

const directory = "dist/";

function main() {
	const t = initTRPC.context<Context>().create();
	const router = appRouter(t);

	const db = new Database(Bun.env.SQLITE);
	const logger = makeLogger();
	const secret = new TextEncoder().encode(Bun.env.SECRET);

	const server = Bun.serve({
		port: 3000,
		async fetch(req) {
			const pathname = new URL(req.url).pathname;

			// we do a little dirty routing
			if (pathname.startsWith("/trpc")) {
				if (Bun.env.NODE_ENV !== "production" && req.method === "OPTIONS") {
					return new Response(undefined, {
						headers: cors,
					});
				}

				const authorization = req.headers.get("authorization");

				const response = await fetchRequestHandler({
					endpoint: "/trpc",
					req,
					router,
					createContext: () => ({
						logger,
						db,
						secret,
						authorization,
					}),
				});

				// TRPC doesn't have a proper way of specifying headers
				if (Bun.env.NODE_ENV !== "production") {
					for (const k in cors) {
						const key = k as keyof typeof cors; // TS is too stupid to deduce it on it's own
						response.headers.append(key, cors[key]);
					}
				}

				return response;
			}

			if (Bun.env.NODE_ENV === "production") {
				const fullPath = path.normalize(path.join(directory, pathname));

				if (fullPath.startsWith(directory)) {
					const file = Bun.file(fullPath);

					if (await file.exists()) {
						return new Response(file);
					}

					return new Response(Bun.file(path.join(directory, "/index.html")));
				}
			}

			return new Response(undefined, { status: 404 });
		},
	});

	logger.info(`Started listening on ${server.port}`);
}

main();
