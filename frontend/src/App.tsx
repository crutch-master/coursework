import type { Component } from "solid-js";
import Comp from "./Comp";

const App: Component = () => {
	return (
		<div class="text-center">
			<h1 class="text-3xl">Hello world!!!!</h1>
			<Comp />
		</div>
	);
};

export default App;
