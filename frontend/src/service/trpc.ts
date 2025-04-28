import {
	createTRPCClient,
	httpBatchLink,
	type HTTPHeaders,
} from "@trpc/client";
import type { AppRouter } from "../../../backend/trpc";

export const makeClient = (headers: () => HTTPHeaders) =>
	createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: import.meta.env.VITE_SERVER_URL,
				headers,
			}),
		],
	});
