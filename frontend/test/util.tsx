import { type Component, createSignal, type Signal } from "solid-js";
import { type Client, ClientContext } from "../src/service/trpc";
import { Route, Router } from "@solidjs/router";
import { render } from "@solidjs/testing-library";

type PublicClient = { [K in keyof Client]: Client[K] };

export class ClientMock implements PublicClient {
	private readonly client: Client["trpc"];

	private readonly tokenSignal: {
		get: Signal<string | null>[0];
		set: Signal<string | null>[1];
	};

	constructor(trpc: Client["trpc"]) {
		this.client = trpc;

		const [get, set] = createSignal<string | null>(null);
		this.tokenSignal = { get, set };
	}

	set token(token: string | null) {
		this.tokenSignal.set(token === null ? null : `Bearer ${token}`);
	}

	get authorized() {
		return this.tokenSignal.get() !== null;
	}

	get trpc() {
		return this.client;
	}
}

export const renderWithRouting = (
	component: Component,
	client: PublicClient,
	options?: Parameters<typeof render>[1],
) =>
	render(
		() => (
			<Router>
				<Route path="/" component={component} />
			</Router>
		),
		{
			location: "/",
			wrapper: (props) => (
				<ClientContext.Provider
					value={client as unknown as Client}
					{...props}
				/>
			),
			...options,
		},
	);
