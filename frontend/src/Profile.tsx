import {
	type Component,
	createResource,
	For,
	Show,
	Suspense,
	useContext,
} from "solid-js";
import { ClientContext, type ClientContextValue } from "./service/trpc";
import Avatar from "./components/Avatar";
import EventCard from "./components/EventCard";
import useProtected from "./util/protected";

const Profile: Component = () => {
	useProtected();

	const client = useContext(ClientContext) as ClientContextValue;

	const [user] = createResource(async () =>
		client.trpc.user.getUserInfo.query(),
	);

	type UserInfo = Extract<ReturnType<typeof user>, { ok: true }>;

	return (
		<div class="w-full flex justify-center">
			<div class="mt-8 w-180 gap-4 flex flex-col items-center">
				<Suspense fallback={<p class="text-center text-xl">Loading...</p>}>
					<Show when={user()?.ok}>
						<div class="w-60">
							<Avatar name={(user() as UserInfo).data.user.name} />
						</div>
						<p class="text-3xl">{(user() as UserInfo).data.user.name}</p>

						<p class="text-xl">Your Events</p>

						<div class="w-full flex flex-row overflow-auto gap-2">
							<For each={(user() as UserInfo).data.events}>
								{(event) => (
									<div class="w-58 shrink-0">
										<EventCard event={event} />
									</div>
								)}
							</For>
						</div>
					</Show>
				</Suspense>
			</div>
		</div>
	);
};

export default Profile;
