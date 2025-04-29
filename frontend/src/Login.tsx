import { createSignal, Match, Show, Switch, type Component } from "solid-js";
import Button from "./components/Button";
import { type AnyFieldApi, createForm } from "@tanstack/solid-form";

const FieldInfo: Component<{ field: AnyFieldApi }> = (props) => (
	<>
		{props.field.state.meta.isTouched && !props.field.state.meta.isValid ? (
			<p class="border-1 border-red-400 rounded-md bg-red-100 text-red-400 p-3">
				{props.field.state.meta.errors.join(",")}
			</p>
		) : null}
		{props.field.state.meta.isValidating ? "Validating..." : null}
	</>
);

const SignIn: Component = () => {
	const form = createForm(() => ({
		defaultValues: {
			login: "",
			password: "",
		},

		onSubmit({ value }) {
			console.log(value);
		},
	}));

	return (
		<form
			onsubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="login"
				validators={{
					onChange: ({ value }) =>
						value.length < 4
							? "Login should be at least 4 characters long"
							: undefined,
				}}
				children={(field) => (
					<div class="mb-4">
						<label class="block mb-2 text-gray-500" for={field().name}>
							Your Login
						</label>

						<input
							class="border-1 border-gray-200 rounded-md block w-full p-3 mb-2"
							placeholder="login"
							id={field().name}
							name={field().name}
							value={field().state.value}
							onBlur={field().handleBlur}
							onInput={(e) => field().handleChange(e.target.value)}
						/>
						<FieldInfo field={field()} />
					</div>
				)}
			/>

			<form.Field
				name="password"
				validators={{
					onChange: ({ value }) =>
						value.length < 8
							? "Password should be at least 8 characters long"
							: undefined,
				}}
				children={(field) => (
					<div class="mb-4">
						<label class="block mb-2 text-gray-500" for={field().name}>
							Your Password
						</label>

						<input
							class="border-1 border-gray-200 rounded-md block w-full p-3 mb-2"
							placeholder="password"
							type="password"
							id={field().name}
							name={field().name}
							value={field().state.value}
							onBlur={field().handleBlur}
							onInput={(e) => field().handleChange(e.target.value)}
						/>
						<FieldInfo field={field()} />
					</div>
				)}
			/>

			<form.Subscribe
				selector={(state) => ({
					canSubmit: state.canSubmit,
				})}
				children={(state) => (
					<Button
						class="mb-4 w-full"
						type="submit"
						disabled={() => !state().canSubmit}
					>
						Sign In
					</Button>
				)}
			/>
		</form>
	);
};

const SignUp: Component = () => <></>;

const Login: Component = () => {
	const [register, setRegister] = createSignal(false);

	return (
		<div class="mt-8 w-120">
			<Switch>
				<Match when={register()}>
					<SignUp />
				</Match>

				<Match when={!register()}>
					<SignIn />
				</Match>
			</Switch>

			<Button class="w-full" onclick={() => setRegister((old) => !old)}>
				<Show when={register()} fallback={"Sign Up Instead"}>
					Sign In Instead
				</Show>
			</Button>
		</div>
	);
};

export default Login;
