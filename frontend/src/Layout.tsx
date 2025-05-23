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
				<nav class="flex flex-col w-60 border-r-1 border-gray-200 shadow-xl">
					<div class="p-2 border-b-1 border-gray-200">
						<h1 class="text-2xl text-zinc-950 p-2 font-bold">Evently</h1>
					</div>

					<nav class="flex flex-col p-2 gap-2">
						<Link href="/" pathname={pathname()}>
							All Events
						</Link>

						<Show when={client.authorized}>
							<Link href="/new" pathname={pathname()}>
								New Event
							</Link>

							<Link href="/profile" pathname={pathname()}>
								Profile
							</Link>
						</Show>
					</nav>

					<div class="flex flex-col p-2 gap-2 border-t-1 border-gray-200 mt-auto">
						<Show
							when={client.authorized}
							fallback={
								<Button class="text-md" onclick={() => navigate("/sign-in")}>
									Sign In
								</Button>
							}
						>
							<Button
								class="text-md"
								onclick={() => {
									client.token = null;
									navigate("/");
								}}
							>
								Sign Out
							</Button>
						</Show>
					</div>
				</nav>

				<div class="w-full h-full">{props.children}</div>
			</div>
		</ClientContext.Provider>
	);
};

export default Layout;
