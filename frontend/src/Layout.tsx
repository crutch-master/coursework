import { createMemo, Show, type Component, type JSXElement } from "solid-js";
import {
	A,
	useLocation,
	useNavigate,
	type RouteSectionProps,
} from "@solidjs/router";
import { Client, ClientContext } from "./service/trpc";
import Button from "./components/Button";

const Link: Component<{
	href: string;
	children: JSXElement;
	pathname: string;
}> = (props) => {
	return (
		<A
			class={`transition text-md p-2 rounded-md ${props.href === props.pathname ? "bg-zinc-800 text-white" : "hover:bg-zinc-100"}`}
			href={props.href}
		>
			{props.children}
		</A>
	);
};

const Layout: Component<RouteSectionProps<unknown>> = (props) => {
	const client = new Client();
	const navigate = useNavigate();

	const location = useLocation();
	const pathname = createMemo(() => location.pathname);

	return (
		<ClientContext.Provider value={client}>
			<div class="flex flex-row h-screen">
				<nav class="flex flex-col w-80 border-r-1 border-gray-200">
					<div class="p-2 border-b-1 border-gray-200">
						<h1 class="text-2xl text-zinc-950 p-2 font-semibold">MegaYayca</h1>
					</div>

					<nav class="flex flex-col p-2 gap-2">
						<Link href="/" pathname={pathname()}>
							Home
						</Link>
					</nav>

					<div class="flex flex-col p-2 gap-2 border-t-1 border-gray-200 mt-auto">
						<Show
							when={!client.authorized}
							fallback={<Button class="text-md">Sign Out</Button>}
						>
							<Button class="text-md" onclick={() => navigate("/sign-in")}>
								Sign In
							</Button>
						</Show>
					</div>
				</nav>

				<div class="w-full flex flex-col items-center">{props.children}</div>
			</div>
		</ClientContext.Provider>
	);
};

export default Layout;
