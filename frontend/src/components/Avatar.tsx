import type { Component } from "solid-js";

const Avatar: Component<{ name: string }> = (props) => {
	const src = () =>
		`https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${props.name}`;

	return (
		<div class="rounded-full w-full border-2 border-gray-200 overflow-hidden">
			<img src={src()} alt="avatar" />
		</div>
	);
};

export default Avatar;
