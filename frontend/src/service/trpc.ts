import {
	createTRPCClient,
	httpBatchLink,
	type HTTPHeaders,
} from "@trpc/client";
import {
	createSignal,
	createContext,
	createEffect,
	type Signal,
} from "solid-js";
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
	private static tokenKey = "auth_token";

	private readonly client: ReturnType<typeof makeClient>;

	private readonly tokenSignal: {
		get: Signal<string | null>[0];
		set: Signal<string | null>[1];
	};

	constructor() {
		this.client = makeClient(() => {
			const token = this.tokenSignal.get();
			return token === null ? {} : { authorization: token };
		});

		const stored = localStorage.getItem(Client.tokenKey);

		const [get, set] = createSignal<string | null>(stored);
		this.tokenSignal = { get, set };

		createEffect(() => {
			const token = this.tokenSignal.get();

			if (token === null) {
				localStorage.removeItem(Client.tokenKey);
			} else {
				localStorage.setItem(Client.tokenKey, token);
			}
		});
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

export type ClientContextValue = Client;

export const ClientContext = createContext<ClientContextValue>();
