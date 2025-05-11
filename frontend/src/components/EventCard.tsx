import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { formatDatetime } from "../util/time";
import type { AppRouter } from "../../../backend/trpc";
import Button from "./Button";

type Event = Awaited<ReturnType<AppRouter["event"]["getPublic"]>>[number];

const EventCard: Component<{ event: Event }> = (props) => {
	const navigate = useNavigate();

	return (
		<div class="w-full flex flex-col items-center gap-4 p-4 border-1 rounded-md border-gray-200">
			<h1 class="text-xl">{props.event.name}</h1>

			<div class="w-full flex flex-row justify-between">
				<p>Start at:</p>
				<p>{formatDatetime(props.event.start)}</p>
			</div>

			<div class="w-full flex flex-row justify-between">
				<p>Duration:</p>
				<p>{props.event.duration} minutes</p>
			</div>

			<Button
				class="w-full"
				onclick={() => navigate(`/details/${props.event.id}`)}
			>
				Details
			</Button>
		</div>
	);
};

export default EventCard;
