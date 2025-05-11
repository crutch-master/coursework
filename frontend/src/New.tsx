import { createForm } from "@tanstack/solid-form";
import { useContext, type Component } from "solid-js";
import { ClientContext, type ClientContextValue } from "./service/trpc";
import { useNavigate } from "@solidjs/router";
import Button from "./components/Button";
import Input from "./components/Input";
import useProtected from "./util/protected";

const datetimeToDate = (datetime: string) => {
	const [date, time] = datetime.split("T");
	const [year, month, day] = date.split("-").map((v) => Number.parseInt(v));
	const [hours, minutes] = time.split(":").map((v) => Number.parseInt(v));
	return new Date(year, month - 1, day, hours, minutes);
};

const New: Component = () => {
	useProtected();

	const navigate = useNavigate();
	const client = useContext(ClientContext) as ClientContextValue;
	const form = createForm(() => ({
		defaultValues: {
			name: "",
			start: "",
			public: false,
			duration: 90,
		},

		async onSubmit({ value: { start: startDatetime, ...event } }) {
			const start = datetimeToDate(startDatetime).getTime();

			const { id } = await client.trpc.event.create.mutate({
				start,
				...event,
			});

			navigate(`/details/${id}`);
		},
	}));

	return (
		<div class="w-full flex justify-center">
			<div class="mt-8 w-120">
				<form
					onsubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.Field
						name="name"
						validators={{
							onChange: ({ value }) =>
								value.length === 0 ? "Name should not be empty" : undefined,
						}}
						children={(field) => (
							<Input field={field()} label="Event Name" placeholder="name" />
						)}
					/>

					<form.Field
						name="start"
						validators={{
							onChange: ({ value }) => {
								const now = new Date().getTime();
								const input = datetimeToDate(value).getTime();

								return input <= now
									? "An event should occur in the future"
									: undefined;
							},
						}}
						children={(field) => (
							<Input
								field={field()}
								label="Event Start"
								placeholder=""
								type="datetime-local"
							/>
						)}
					/>

					<form.Field
						name="public"
						children={(field) => (
							<Input
								field={field()}
								label="Public"
								placeholder=""
								type="checkbox"
								onInput={(e) => field().handleChange(e.target.checked)}
							/>
						)}
					/>

					<form.Field
						name="duration"
						validators={{
							onChange: ({ value }) =>
								value <= 0 ? "Duration should be positive" : undefined,
						}}
						children={(field) => (
							<Input
								field={field()}
								label="Event Duration"
								placeholder="90"
								type="number"
							/>
						)}
					/>

					<form.Subscribe
						selector={(state) => ({
							canSubmit: state.canSubmit,
						})}
						children={(state) => (
							<Button
								class="w-full"
								type="submit"
								disabled={!state().canSubmit}
							>
								Create Event
							</Button>
						)}
					/>
				</form>
			</div>
		</div>
	);
};

export default New;
