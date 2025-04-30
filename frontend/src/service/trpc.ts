import {
	createTRPCClient,
	httpBatchLink,
	type HTTPHeaders,
} from "@trpc/client";
import { createSignal, createContext, type Signal } from "solid-js";
import type { AppRouter } from "../../../backend/trpc";

const makeClient = (headers: () => HTTPHeaders) =>
	createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: import.meta.env.VITE_SERVER_URL,
				headers,
			}),
		],
	});

export class Client {
	private readonly client: ReturnType<typeof makeClient>;

	// this is a signal so that the `authorized` getter is reactive
	private readonly tokenSignal: Signal<string | null>;

	constructor() {
		this.client = makeClient(() => {
			const token = this.tokenSignal[0]();
			return token === null ? {} : { authorization: token };
		});

		// TODO: load from storage
		this.tokenSignal = createSignal<string | null>(null);
	}

	set token(token: string | null) {
		this.tokenSignal[1](token);
	}

	get authorized() {
		return this.tokenSignal[0]() !== null;
	}

	get trpc() {
		return this.client;
	}
}

export type ClientContextValue = Client;

export const ClientContext = createContext<ClientContextValue>();
