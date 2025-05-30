import { z } from "zod";
import type { Context, RouterBuildArg } from ".";
import { authorized } from "./middleware";

export type Event = {
	id: string;
	name: string;
	start: number;
	duration: number;
	public: boolean;
	host_id: number;
};

export function eventsRouter({ procedure, router }: RouterBuildArg<Context>) {
	const authorizedProcedure = authorized(procedure);

	return router({
		getPublic: procedure
			.input(
				z.object({
					from: z.number(),
					to: z.number(),
				}),
			)
			.query(async ({ ctx, input }) => {
				type Row = Pick<Event, "id" | "name" | "start" | "duration">;

				const rows = ctx.db
					.query(`
						select id, name, start, duration
						from events
						where public = true and start >= $start and start < $end
						order by start
					`)
					.all({ $start: input.from, $end: input.to }) as Row[];

				return rows;
			}),

		create: authorizedProcedure
			.input(
				z.object({
					name: z.string(),
					start: z.number(),
					public: z.boolean(),
					duration: z.number(),
				}),
			)
			.mutation(async ({ input, ctx }) => {
				const id = Bun.randomUUIDv7();

				ctx.db
					.query(`
						insert into events (id, name, start, duration, public, host_id)
						values ($id, $name, $start, $duration, $public, $host_id)
					`)
					.run({
						$id: id,
						$name: input.name,
						$start: input.start,
						$duration: input.duration,
						$public: input.public,
						$host_id: ctx.user.id,
					});

				return { id };
			}),

		getDetails: procedure
			.input(
				z.object({
					id: z.string(),
				}),
			)
			.query(async ({ input, ctx }) => {
				type Row = Pick<Event, "name" | "start" | "duration" | "public"> & {
					host_name: string;
					user_name?: string;
				};

				const rows = ctx.db
					.query(`
						select
							events.name,
							events.start,
							events.duration,
							events.public,
							host.name as host_name,
							users.name as user_name
						from events
						inner join users host
						on events.host_id = host.id
						left join event_visitor
						on event_visitor.event_id = events.id
						left join users
						on users.id = event_visitor.user_id
						where events.id = $id
					`)
					.all({ $id: input.id }) as Row[];

				if (!rows[0]) {
					// not a length check bc TS is stupid and cannot deduce
					// that a non-zero length means non-undefined first element
					return { ok: false, error: "Event not Found" } as const;
				}

				const event: Omit<Row, "user_name"> & { users: string[] } = {
					...{ ...rows[0], user_name: undefined },
					users: [],
				};

				for (const row of rows) {
					if (!row.user_name) {
						continue;
					}

					event.users.push(row.user_name);
				}

				return { ok: true, data: { event } } as const;
			}),

		signup: authorizedProcedure
			.input(z.object({ id: z.string() }))
			.mutation(async ({ ctx, input }) => {
				let updated = false;

				ctx.db.transaction(() => {
					const { count } = ctx.db
						.query(`
							select count(event_id) as count
							from event_visitor
							where user_id = $user_id and event_id = $event_id
						`)
						.get({ $user_id: ctx.user.id, $event_id: input.id }) as {
						count: number;
					};

					if (count > 0) {
						return;
					}

					ctx.db
						.query(`
							insert into event_visitor (event_id, user_id)
							values ($event_id, $user_id)
						`)
						.run({ $user_id: ctx.user.id, $event_id: input.id });

					updated = true;
				})();

				return { updated };
			}),
	});
}
