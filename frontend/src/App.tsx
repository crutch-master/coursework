import type { Component } from "solid-js";
import Comp from "./Comp";
import { makeClient } from "./service/trpc";

const App: Component = () => {
	setTimeout(async () => {
		const client = makeClient(() => new Headers());
		const resp = await client.hello.query({ msg: "idunno" });
		console.log(resp);
	}, 1000);

	return (
		<div class="text-center">
			<h1 class="text-3xl">Hello world!!!!</h1>
			<Comp />
		</div>
	);
};

export default App;
