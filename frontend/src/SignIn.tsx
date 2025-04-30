import {
	createSignal,
	Match,
	Show,
	Switch,
	useContext,
	type Component,
} from "solid-js";
import Button from "./components/Button";
import { type AnyFieldApi, createForm } from "@tanstack/solid-form";
import { useNavigate } from "@solidjs/router";
import { type ClientContextValue, ClientContext } from "./service/trpc";

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

const SignInForm: Component = () => {
	const navigate = useNavigate();
	const client = useContext(ClientContext) as ClientContextValue;
	const [error, setError] = createSignal<string | null>(null);

	const form = createForm(() => ({
		defaultValues: {
			login: "",
			password: "",
		},

		async onSubmit({ value }) {
			const result = await client.trpc.user.login.mutate({
				login: value.login,
				password: value.password,
			});

			if (!result.ok) {
				setError(result.error);
				return;
			}

			client.token = result.data.token;
			setError(null);
			navigate("/");
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

			<Show when={error() !== null}>
				<p class="border-1 border-red-400 rounded-md bg-red-100 text-red-400 p-3 mb-4">
					{error()}
				</p>
			</Show>

			<form.Subscribe
				selector={(state) => ({
					canSubmit: state.canSubmit,
				})}
				children={(state) => (
					<Button
						class="mb-4 w-full"
						type="submit"
						disabled={!state().canSubmit}
					>
						Sign In
					</Button>
				)}
			/>
		</form>
	);
};

const SignUpForm: Component<{ onOk: () => void }> = (props) => {
	const client = useContext(ClientContext) as ClientContextValue;
	const [error, setError] = createSignal<string | null>(null);

	const form = createForm(() => ({
		defaultValues: {
			name: "",
			login: "",
			password1: "",
			password2: "",
		},

		validators: {
			onChange: ({ value }) =>
				value.password1 !== value.password2
					? { fields: { password2: "Passwords didn't match" } }
					: null,
		},

		async onSubmit({ value }) {
			const res = await client.trpc.user.create.mutate({
				name: value.name,
				login: value.login,
				password: value.password1,
			});

			if (!res.ok) {
				setError(res.error);
				return;
			}

			setError(null);
			props.onOk();
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
				name="name"
				validators={{
					onChange: ({ value }) =>
						value.length < 4
							? "Name should be at least 4 characters long"
							: undefined,
				}}
				children={(field) => (
					<div class="mb-4">
						<label class="block mb-2 text-gray-500" for={field().name}>
							Your Name
						</label>

						<input
							class="border-1 border-gray-200 rounded-md block w-full p-3 mb-2"
							placeholder="name"
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
				name="password1"
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

			<form.Field
				name="password2"
				validators={{
					onChange: ({ value }) =>
						value.length < 8
							? "Password should be at least 8 characters long"
							: undefined,
				}}
				children={(field) => (
					<div class="mb-4">
						<label class="block mb-2 text-gray-500" for={field().name}>
							Repeat Password
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

			<Show when={error() !== null}>
				<p class="border-1 border-red-400 rounded-md bg-red-100 text-red-400 p-3 mb-4">
					{error()}
				</p>
			</Show>

			<form.Subscribe
				selector={(state) => ({
					canSubmit: state.canSubmit,
				})}
				children={(state) => (
					<Button
						class="mb-4 w-full"
						type="submit"
						disabled={!state().canSubmit}
					>
						Sign Up
					</Button>
				)}
			/>
		</form>
	);
};

const SignIn: Component = () => {
	const [register, setRegister] = createSignal(false);

	return (
		<div class="mt-8 w-120">
			<Switch>
				<Match when={register()}>
					<SignUpForm onOk={() => setRegister(false)} />
				</Match>

				<Match when={!register()}>
					<SignInForm />
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

export default SignIn;
