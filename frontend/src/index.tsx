/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import "./index.css";
import Events from "./Events";
import Layout from "./Layout";
import SignIn from "./SignIn";
import Profile from "./Profile";
import New from "./New";
import Details from "./Details";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		"Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
	);
}

render(
	() => (
		<Router root={Layout}>
			<Route path="/" component={Events} />
			<Route path="/sign-in" component={SignIn} />
			<Route path="/profile" component={Profile} />
			<Route path="/new" component={New} />
			<Route path="/details/:id" component={Details} />
		</Router>
	),
	root as HTMLElement,
);
