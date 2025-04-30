import { useNavigate } from "@solidjs/router";
import {
	type Component,
	createEffect,
	createResource,
	Show,
	useContext,
} from "solid-js";
import { ClientContext, type ClientContextValue } from "./service/trpc";

const Profile: Component = () => {
	const navigate = useNavigate();
	const client = useContext(ClientContext) as ClientContextValue;

	createEffect(() => {
		if (!client.authorized) {
			navigate("/");
		}
	});

	const [user] = createResource(async () =>
		client.trpc.user.getUserInfo.query(),
	);

	type UserInfo = Extract<
		Awaited<ReturnType<typeof client.trpc.user.getUserInfo.query>>,
		{ ok: true }
	>;

	return (
		<div class="mt-8 w-100">
			<Show
				when={!user.loading}
				fallback={<p class="text-center text-xl">Loading...</p>}
			>
				<Show when={user()?.ok}>
					<p class="text-xl font-semibold mb-2">Your name:</p>
					<p class="text-2xl border-1 border-gray-200 rounded-md w-full p-2">
						{(user() as UserInfo).data.user.name}
					</p>
				</Show>
			</Show>
		</div>
	);
};

export default Profile;
