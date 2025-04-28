import type { Context, RouterBuildArg } from ".";
import { SQLiteError } from "bun:sqlite";
import { z } from "zod";

export const userRouter = ({ procedure, router }: RouterBuildArg<Context>) =>
	router({
		create: procedure
			.input(
				z.object({
					login: z.string(),
					password: z.string(),
					name: z.string(),
				}),
			)
			.mutation(({ ctx, input }) => {
				const password = Bun.hash(input.password);

				try {
					const { id } = ctx.db
						.query(`
							insert into users (name, login, password)
							values ($name, $login, $password)
							returning id
						`)
						.get({
							$name: input.name,
							$login: input.login,
							$password: password,
						}) as { id: string };

					return { ok: true, data: { id } };
				} catch (err) {
					// all the error codes:
					// https://sqlite.org/rescode.html
					if (
						err instanceof SQLiteError &&
						err.code === "SQLITE_CONSTRAINT_UNIQUE"
					) {
						return { ok: false, error: "login taken" };
					}

					throw err;
				}
			}),
	});
