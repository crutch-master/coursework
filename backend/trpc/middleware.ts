import { jwtVerify } from "jose";
import { TRPCError } from "@trpc/server";
import type { Context, RouterBuildArg } from ".";

type Procedure<T extends object> = RouterBuildArg<T>["procedure"];

export const logged = <T extends Pick<Context, "logger">>(
	procedure: Procedure<T>,
) =>
	procedure.use((opts) => {
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

export const authorized = <T extends Pick<Context, "secret" | "authorization">>(
	procedure: Procedure<T>,
) =>
	procedure.use(async (opts) => {
		const prefix = "Bearer ";

		if (
			opts.ctx.authorization === null ||
			!opts.ctx.authorization.startsWith(prefix)
		) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}

		const token = opts.ctx.authorization.slice(prefix.length);
		const { payload } = await jwtVerify<{ id: number }>(token, opts.ctx.secret);

		return opts.next({
			ctx: { ...opts.ctx, user: payload },
		});
	});
