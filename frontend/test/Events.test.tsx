import { test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import Events from "../src/Events";
import { ClientMock, renderWithRouting } from "./util";

const user = userEvent.setup();

test("renders events", async () => {
	const client = new ClientMock({
		event: {
			getPublic: {
				query: () =>
					Promise.resolve([
						{
							name: "test",
							id: "test",
							start: new Date().getTime(),
							duration: 1,
						},
					]),
			},
		},
	} as unknown as ClientMock["client"]);
	client.token = "";

	const { findByText, findAllByTitle } = renderWithRouting(
		() => <Events />,
		client,
	);

	const next = await findByText("👉");
	const days = await findAllByTitle("day");

	expect(days[0].children.length).toEqual(0);
	expect(days[1].children.length).toEqual(1);

	await user.click(next);
	expect(days[0].children.length).toEqual(1);
	expect(days[1].children.length).toEqual(0);
});
