import type { TRPCBuilder } from "@trpc/server";
import type { Logger } from "pino";
import { z } from "zod";

export type Context = {
	logger: Logger;
};

export function appRouter({
	procedure,
	router,
}: ReturnType<TRPCBuilder<Context, object>["create"]>) {
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
	});
}

export type AppRouter = ReturnType<typeof appRouter>;
