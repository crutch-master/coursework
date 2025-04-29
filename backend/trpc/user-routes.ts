import type { Context, RouterBuildArg } from ".";
import { SQLiteError } from "bun:sqlite";
import { z } from "zod";
import { authorized } from "./middleware";
import { SignJWT } from "jose";

export function userRouter({ procedure, router }: RouterBuildArg<Context>) {
	const authorizedProcedure = authorized(procedure);

	return router({
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
						return { ok: false, error: "login taken" } as const;
					}

					throw err;
				}
			}),

		login: procedure
			.input(z.object({ login: z.string(), password: z.string() }))
			.mutation(async ({ ctx, input }) => {
				type Row = {
					id: string;
					password: string;
				};

				const row = ctx.db
					.query(`
						select id, password
						from users
						where login = $login
					`)
					.get({ $login: input.login }) as Row | null;

				if (row === null) {
					return { ok: false, error: "bad creds" } as const;
				}

				const hash = await Bun.password.hash(row.password);

				if (hash !== row.password) {
					return { ok: false, error: "bad creds" } as const;
				}

				const token = new SignJWT({ id: row.id })
					.setIssuedAt()
					.setExpirationTime("24h")
					.sign(ctx.secret);

				return { ok: true, data: { token } };
			}),

		getUserInfo: authorizedProcedure
			.input(z.undefined())
			.query(async ({ ctx }) => {
				type Row = {
					name: string;
				};

				const row = ctx.db
					.query(`
						select name
						from users
						where id = $id
					`)
					.get({ $id: ctx.user.id }) as Row | null;

				if (row === null) {
					return { ok: false, error: "user not found" } as const;
				}

				return { ok: true, data: { user: row } };
			}),
	});
}
