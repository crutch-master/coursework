import { useNavigate } from "@solidjs/router";
import { createEffect, useContext } from "solid-js";
import { ClientContext, type ClientContextValue } from "../service/trpc";

export default function useProtected() {
	const navigate = useNavigate();
	const client = useContext(ClientContext) as ClientContextValue;

	createEffect(() => {
		if (!client.authorized) {
			navigate("/sign-in");
		}
	});
}
