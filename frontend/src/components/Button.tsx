import type { Component, JSX, JSXElement } from "solid-js";

const Button: Component<{
	class?: string;
	onclick?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["onclick"];
	children: JSXElement;
	disabled?: boolean;
	type?: "button" | "reset" | "submit";
}> = (props) => {
	return (
		<button
			class={`transition p-2 rounded-md bg-zinc-800 ${props.disabled ? "text-zinc-400" : "text-white hover:bg-zinc-700 active:bg-zinc-600"} ${props.class ?? ""}`}
			onclick={props.onclick}
			type={props.type}
			disabled={props.disabled}
		>
			{props.children}
		</button>
	);
};

export default Button;
