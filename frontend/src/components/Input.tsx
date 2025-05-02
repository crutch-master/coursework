import type { AnyFieldApi } from "@tanstack/solid-form";
import type { Component, JSX } from "solid-js";

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

export const Input: Component<{
	field: AnyFieldApi;
	label: string;
	placeholder: string;
	type?: string;
	onInput?: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent>;
}> = (props) => (
	<div class="mb-4">
		<label class="block mb-2 text-gray-500" for={props.field.name}>
			{props.label}
		</label>

		<input
			class="border-1 border-gray-200 rounded-md block w-full p-3 mb-2"
			placeholder={props.placeholder}
			type={props.type}
			id={props.field.name}
			name={props.field.name}
			value={props.field.state.value}
			onBlur={props.field.handleBlur}
			onInput={
				props.onInput ?? ((e) => props.field.handleChange(e.target.value))
			}
		/>

		<FieldInfo field={props.field} />
	</div>
);
