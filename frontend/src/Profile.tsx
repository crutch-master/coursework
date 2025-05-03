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
import Avatar from "./components/Avatar";

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
			<div class="mt-8 w-80 gap-8 flex flex-col items-center">
				<Suspense fallback={<p class="text-center text-xl">Loading...</p>}>
					<Show when={user()?.ok}>
						<div class="w-full">
							<Avatar name={(user() as UserInfo).data.user.name} />
						</div>
						<p class="text-2xl">{(user() as UserInfo).data.user.name}</p>
					</Show>
				</Suspense>
			</div>
		</div>
	);
};

export default Profile;
