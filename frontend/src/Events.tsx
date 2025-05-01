import {
	createSignal,
	createResource,
	For,
	useContext,
	type Component,
} from "solid-js";
import type { AppRouter } from "../../backend/trpc";
import Button from "./components/Button";
import { useNavigate } from "@solidjs/router";
import { ClientContext, type ClientContextValue } from "./service/trpc";

type Event = Awaited<ReturnType<AppRouter["event"]["getPublic"]>>[number];

const Day: Component<{ events: Event[]; date: string }> = (props) => {
	const navigate = useNavigate();

	return (
		<div class="w-full h-full p-4 rounded-md shadow-xl border-1 border-gray-200 flex flex-col items-center gap-4">
			<h1 class="text-2xl">{props.date}</h1>

			<div class="w-full h-full overflow-auto flex flex-col gap-4">
				<For each={props.events}>
					{(event) => (
						<div class="w-full flex flex-col items-center gap-4 p-4 border-1 rounded-md border-gray-200">
							<h1 class="text-xl">{event.name}</h1>

							<div class="w-full flex flex-row justify-between">
								<p>Start at:</p>
								<p>{event.start}</p>
							</div>

							<div class="w-full flex flex-row justify-between">
								<p>Duration:</p>
								<p>{event.duration} minutes</p>
							</div>

							<Button
								class="w-full"
								onclick={() => navigate(`/details/${event.id}`)}
							>
								Details
							</Button>
						</div>
					)}
				</For>
			</div>
		</div>
	);
};

const msInDay = 24 * 60 * 60 * 1000;

const formatTime = (time: number) => {
	const date = new Date(time);
	return `${date.getDay().toString().padStart(2, "0")}.${date.getMonth().toString().padStart(2, "0")}.${date.getFullYear()}`;
};

const Events: Component = () => {
	const [currDay, _] = createSignal(new Date().setHours(0, 0, 0, 0));
	const nextDay = () => currDay() + msInDay;
	const prevDay = () => currDay() - msInDay;

	const client = useContext(ClientContext) as ClientContextValue;

	const [events] = createResource(
		() => ({ from: prevDay(), to: nextDay() + msInDay }),
		(input) => client.trpc.event.getPublic.query(input),
	);

	const prevDayEvents = () =>
		events()?.filter(({ start }) => start < currDay());

	const currDayEvents = () =>
		events()?.filter(({ start }) => start >= currDay() && start < nextDay());

	const nextDayEvents = () =>
		events()?.filter(({ start }) => start >= nextDay());

	return (
		<div class="w-full h-full p-16 flex flex-row gap-16">
			<Day date={formatTime(prevDay())} events={prevDayEvents() ?? []} />
			<Day date={formatTime(currDay())} events={currDayEvents() ?? []} />
			<Day date={formatTime(nextDay())} events={nextDayEvents() ?? []} />
		</div>
	);
};

export default Events;
