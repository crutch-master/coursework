import type { Context, RouterBuildArg } from ".";
import { SQLiteError } from "bun:sqlite";
import { z } from "zod";
import { authorized } from "./middleware";
import { SignJWT } from "jose";

export type User = {
	id: number;
	name: string;
	login: string;
	password: string;
};

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
			.mutation(async ({ ctx, input }) => {
				type Row = Pick<User, "id">;

				const password = await Bun.password.hash(input.password);

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
						}) as Row;

					return { ok: true, data: { id } } as const;
				} catch (err) {
					// all the error codes:
					// https://sqlite.org/rescode.html
					if (
						err instanceof SQLiteError &&
						err.code === "SQLITE_CONSTRAINT_UNIQUE"
					) {
						return { ok: false, error: "Login Taken" } as const;
					}

					throw err;
				}
			}),

		login: procedure
			.input(z.object({ login: z.string(), password: z.string() }))
			.mutation(async ({ ctx, input }) => {
				type Row = Pick<User, "id" | "password">;

				const row = ctx.db
					.query(`
						select id, password
						from users
						where login = $login
					`)
					.get({ $login: input.login }) as Row | null;

				if (row === null) {
					return { ok: false, error: "Invalid Credentials" } as const;
				}

				const isValid = await Bun.password.verify(input.password, row.password);

				if (!isValid) {
					return { ok: false, error: "Invalid Credentials" } as const;
				}

				const token = await new SignJWT({ id: row.id })
					.setProtectedHeader({ alg: "HS256" })
					.setIssuedAt()
					.setExpirationTime("24h")
					.sign(ctx.secret);

				return { ok: true, data: { token } } as const;
			}),

		getUserInfo: authorizedProcedure
			.input(z.undefined())
			.query(async ({ ctx }) => {
				type Row = Pick<User, "name">;

				const row = ctx.db
					.query(`
						select name
						from users
						where id = $id
					`)
					.get({ $id: ctx.user.id }) as Row | null;

				if (row === null) {
					return { ok: false, error: "User not Found" } as const;
				}

				return { ok: true, data: { user: row } } as const;
			}),
	});
}
