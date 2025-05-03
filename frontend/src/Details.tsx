import { useParams } from "@solidjs/router";
import {
	createResource,
	For,
	Show,
	Suspense,
	useContext,
	type Component,
} from "solid-js";
import { ClientContext, type ClientContextValue } from "./service/trpc";
import Button from "./components/Button";
import { formatDatetime } from "./util/time";
import Avatar from "./components/Avatar";

const Details: Component = () => {
	const params = useParams();
	const client = useContext(ClientContext) as ClientContextValue;
	const [event] = createResource({ id: params.id }, ({ id }) =>
		client.trpc.event.getDetails.query({ id }),
	);

	type Event = Extract<ReturnType<typeof event>, { ok: true }>;

	return (
		<div class="w-full h-full flex justify-center">
			<div class="w-100 h-full flex flex-col items-center gap-2">
				<Suspense fallback={<p class="text-center text-xl">Loading...</p>}>
					<Show
						when={event()?.ok}
						fallback={<p class="text-center text-xl">Event not Found</p>}
					>
						<div class="w-full flex flex-row justify-between mt-8">
							<div class="w-60 flex flex-col items-center gap-2">
								<h1 class="text-3xl mb-2">
									{(event() as Event).data.event.name}
								</h1>

								<div class="w-full flex flex-row justify-between">
									<p class="font-medium">Start at</p>
									<p>{formatDatetime((event() as Event).data.event.start)}</p>
								</div>

								<div class="w-full flex flex-row justify-between">
									<p class="font-medium">Duration</p>
									<p>{(event() as Event).data.event.duration} minutes</p>
								</div>

								<div class="w-full flex flex-row justify-between">
									<p class="font-medium">Public</p>
									<p>{(event() as Event).data.event.public ? "Yes" : "No"}</p>
								</div>
							</div>

							<div class="w-30 flex flex-col items-center gap-2">
								<p class="font-medium">Host</p>
								<Avatar name={(event() as Event).data.event.host_name} />
								<p class="text-xl">{(event() as Event).data.event.host_name}</p>
							</div>
						</div>

						<p class="text-2xl">Visitors</p>

						<div class="h-full w-full overflow-auto">
							<div class="w-full flex flex-row flex-wrap justify-between gap-y-2">
								<For each={(event() as Event).data.event.users}>
									{(item) => (
										<div class="w-18">
											<Avatar name={item} />
										</div>
									)}
								</For>
							</div>
						</div>

						<Button class="w-full mt-auto mb-2">Join</Button>
					</Show>
				</Suspense>
			</div>
		</div>
	);
};

export default Details;
