import { test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import Details from "../src/Details";
import { ClientMock, renderWithRouting } from "./util";

const user = userEvent.setup();

test("render details", async () => {
	const calls = {
		query: 0,
		signup: 0,
	};

	const client = new ClientMock({
		event: {
			getDetails: {
				query() {
					calls.query += 1;

					return Promise.resolve({
						ok: true,
						data: {
							event: {
								name: "test",
								public: false,
								start: new Date().getTime(),
								duration: 1,
								host_name: "tester",
								users: [],
							},
						},
					});
				},
			},

			signup: {
				mutate() {
					calls.signup += 1;

					return Promise.resolve({ updated: true });
				},
			},
		},
	} as unknown as ClientMock["client"]);

	client.token = "";

	const { findByText } = renderWithRouting(() => <Details />, client);

	const join = await findByText("Join");
	expect(calls.query).toEqual(1);
	await user.click(join);

	expect(calls.signup).toEqual(1);
	expect(calls.query).toEqual(2);
});
