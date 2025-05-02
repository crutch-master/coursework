import { useParams } from "@solidjs/router";
import {
	createResource,
	Show,
	Suspense,
	useContext,
	type Component,
} from "solid-js";
import { ClientContext, type ClientContextValue } from "./service/trpc";
import Button from "./components/Button";
import { formatDatetime } from "./util/time";

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
						<h1 class="text-3xl mt-8">{(event() as Event).data.event.name}</h1>

						<div class="w-full flex flex-row justify-between">
							<p class="font-semibold">Start at</p>
							<p>{formatDatetime((event() as Event).data.event.start)}</p>
						</div>

						<div class="w-full flex flex-row justify-between">
							<p class="font-semibold">Duration</p>
							<p>{(event() as Event).data.event.duration} minutes</p>
						</div>

						<div class="w-full flex flex-row justify-between">
							<p class="font-semibold">Public</p>
							<p>{(event() as Event).data.event.public ? "Yes" : "No"}</p>
						</div>

						<p class="text-2xl">Visitors</p>

						{/* TODO: show visitors */}
						<div class="h-full w-full overflow-auto" />

						<Button class="w-full mt-auto mb-2">Join</Button>
					</Show>
				</Suspense>
			</div>
		</div>
	);
};

export default Details;
