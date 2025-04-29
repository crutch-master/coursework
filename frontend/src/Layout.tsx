import { createMemo, Show, type Component, type JSXElement } from "solid-js";
import { A, useLocation, type RouteSectionProps } from "@solidjs/router";
import { Client, ClientContext } from "./service/trpc";

const Link: Component<{
	href: string;
	children: JSXElement;
}> = ({ href, children }) => {
	const location = useLocation();
	const pathname = createMemo(() => location.pathname);

	return (
		<A
			class={`text-md p-2 rounded-md ${href === pathname() ? "bg-gray-100" : "hover:bg-gray-50 active:bg-gray-100"}`}
			href={href}
		>
			{children}
		</A>
	);
};

const Layout: Component<RouteSectionProps<unknown>> = (props) => {
	const client = new Client();

	return (
		<ClientContext.Provider value={client}>
			<div class="flex flex-row h-screen">
				<nav class="flex flex-col w-80 border-r-1 border-gray-200">
					<div class="p-2 border-b-1 border-gray-200">
						<h1 class="text-2xl p-2 font-semibold">MegaYayca</h1>
					</div>

					<nav class="flex flex-col p-2 gap-2">
						<Link href="/">Home</Link>
					</nav>

					<div class="flex flex-col p-2 gap-2 border-t-1 border-gray-200 mt-auto">
						<Show
							when={!client.authorized}
							fallback={<h1 class="text-xl">Logout</h1>}
						>
							<Link href="/sign-in">Sign In</Link>
						</Show>
					</div>
				</nav>

				<div class="w-full flex flex-col items-center">{props.children}</div>
			</div>
		</ClientContext.Provider>
	);
};

export default Layout;
