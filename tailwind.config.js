/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
		"./error.vue",
	],
	safelist: [
		"grid-cols-1",
		"grid-cols-2",
		"grid-cols-3",
		"grid-cols-4",
		"grid-cols-5",
		"grid-cols-6",
		"grid-cols-7",
		"grid-cols-8",
		"text-amber-500",
		"text-amber-600",
		"text-amber-700",
		"text-amber-800",
		"text-zinc-500",
		"text-zinc-600",
		"text-zinc-700",
		"text-zinc-800",
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
