import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
	plugins: [webfontDownload(), tailwindcss(), solidPlugin()],
	build: {
		target: "esnext",
	},
});
