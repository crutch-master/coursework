import type { TRPCBuilder } from "@trpc/server";
import type { Logger } from "pino";
import type { Database } from "bun:sqlite";
import { z } from "zod";
import { userRouter } from "./user-routes";
import { logged } from "./middleware";

export type Context = {
	logger: Logger;
	db: Database;
	secret: Uint8Array;

	authorization: string | null;
};

export type RouterBuildArg<T extends object> = Pick<
	ReturnType<TRPCBuilder<T, object>["create"]>,
	"procedure" | "router"
>;

export function appRouter({ procedure: p, router }: RouterBuildArg<Context>) {
	const procedure = logged(p);

	return router({
		hello: procedure
			.input(z.object({ msg: z.string() }))
			.query(({ input, ctx }) => {
				ctx.logger.info(`got ${input.msg}`);
				return `hello ${input.msg}`;
			}),
		user: userRouter({ procedure, router }),
	});
}

export type AppRouter = ReturnType<typeof appRouter>;
