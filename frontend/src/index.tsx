/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import Layout from "./Layout";
import Login from "./Login";
import "./index.css";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		"Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
	);
}

render(
	() => (
		<Router root={Layout}>
			<Route path="/" component={() => <h1 class="text-3xl">root</h1>} />
			<Route path="/sign-in" component={Login} />
		</Router>
	),
	root as HTMLElement,
);
