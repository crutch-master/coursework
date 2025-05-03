import {
	createSignal,
	createResource,
	For,
	useContext,
	type Component,
} from "solid-js";
import { ClientContext, type ClientContextValue } from "./service/trpc";
import { formatDate, msInDay } from "./util/time";
import EventCard from "./components/EventCard";
import Button from "./components/Button";

const Day: Component<{
	events: Parameters<typeof EventCard>[number]["event"][];
	date: string;
}> = (props) => {
	return (
		<div class="w-full h-full p-4 rounded-md shadow-xl border-1 border-gray-200 flex flex-col items-center gap-4">
			<h1 class="text-2xl">{props.date}</h1>

			<div class="w-full h-full overflow-auto flex flex-col gap-4">
				<For each={props.events}>{(event) => <EventCard event={event} />}</For>
			</div>
		</div>
	);
};

const Events: Component = () => {
	const [currDay, setCurrDay] = createSignal(new Date().setHours(0, 0, 0, 0));
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
		<div class="w-full h-full p-8 flex flex-row gap-8 items-center">
			<Button class="h-20" onclick={() => setCurrDay(prevDay())}>
				👈
			</Button>
			<Day date={formatDate(prevDay())} events={prevDayEvents() ?? []} />
			<Day date={formatDate(currDay())} events={currDayEvents() ?? []} />
			<Day date={formatDate(nextDay())} events={nextDayEvents() ?? []} />
			<Button class="h-20" onclick={() => setCurrDay(nextDay())}>
				👉
			</Button>
		</div>
	);
};

export default Events;
