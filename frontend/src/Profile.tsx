import { useNavigate } from "@solidjs/router";
import {
	type Component,
	createEffect,
	createResource,
	Show,
	Suspense,
	useContext,
} from "solid-js";
import { ClientContext, type ClientContextValue } from "./service/trpc";

const Profile: Component = () => {
	const navigate = useNavigate();
	const client = useContext(ClientContext) as ClientContextValue;

	createEffect(() => {
		if (!client.authorized) {
			navigate("/sign-in");
		}
	});

	const [user] = createResource(async () =>
		client.trpc.user.getUserInfo.query(),
	);

	type UserInfo = Extract<ReturnType<typeof user>, { ok: true }>;

	return (
		<div class="w-full flex justify-center">
			<div class="mt-8 w-100">
				<Suspense fallback={<p class="text-center text-xl">Loading...</p>}>
					<Show when={user()?.ok}>
						<p class="text-xl font-semibold mb-2">Your name:</p>
						<p class="text-2xl border-1 border-gray-200 rounded-md w-full p-2">
							{(user() as UserInfo).data.user.name}
						</p>
					</Show>
				</Suspense>
			</div>
		</div>
	);
};

export default Profile;
