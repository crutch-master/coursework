import { createSignal, Show, type Component } from "solid-js";

const Login: Component = () => {
	const [register, setRegister] = createSignal(false);

	return (
		<button onclick={() => setRegister((old) => !old)} type="button">
			<Show when={register()} fallback={<>Sign up</>}>
				Sign in
			</Show>
		</button>
	);
};

export default Login;
