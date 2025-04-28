import type { TRPCBuilder } from "@trpc/server";
import type { Logger } from "pino";
import type { Database } from "bun:sqlite";
import { z } from "zod";
import { userRouter } from "./user-routes";

export type Context = {
	logger: Logger;
	db: Database;
};

export type RouterBuildArg<T extends object> = Pick<
	ReturnType<TRPCBuilder<T, object>["create"]>,
	"procedure" | "router"
>;

export function appRouter({ procedure, router }: RouterBuildArg<Context>) {
	const loggedProcedure = procedure.use((opts) => {
		const logger = opts.ctx.logger.child({
			path: opts.path,
			type: opts.type,
		});

		return opts.next({
			ctx: {
				...opts.ctx,
				logger,
			},
		});
	});

	return router({
		hello: loggedProcedure
			.input(z.object({ msg: z.string() }))
			.query(({ input, ctx }) => {
				ctx.logger.info(`got ${input.msg}`);
				return `hello ${input.msg}`;
			}),
		user: userRouter({ procedure: loggedProcedure, router }),
	});
}

export type AppRouter = ReturnType<typeof appRouter>;
