import type { Component, JSX, JSXElement } from "solid-js";

const Button: Component<{
	class?: string;
	onclick?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["onclick"];
	children: JSXElement;
	disabled?: () => boolean;
	type?: "button" | "reset" | "submit";
}> = ({ class: c, onclick, children, disabled, type }) => {
	const isDisabled = () => (disabled === undefined ? false : disabled());

	const allClasses = () =>
		`transition p-2 rounded-md bg-zinc-800 ${isDisabled() ? "text-zinc-400" : "text-white hover:bg-zinc-700 active:bg-zinc-600"} ${c ?? ""}`;

	return (
		<button
			class={allClasses()}
			onclick={onclick}
			type={type}
			disabled={isDisabled()}
		>
			{children}
		</button>
	);
};

export default Button;
