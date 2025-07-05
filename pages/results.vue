<template>
	<div class="flex flex-col gap-y-4 mt-10 w-4/5 mx-auto">
		<div
			class="flex flex-col gap-2 border-4 border-black rounded w-full px-4 py-2 mx-auto"
			:style="{ backgroundColor: firstPlace?.team.color || '#eab308' }">
			<h1
				class="text-[#ffc60a] text-6xl font-bold drop-shadow-md mx-auto"
				style="-webkit-text-stroke: 2px black">
				Winner!
			</h1>
			<div
				class="flex flex-col gap-1 mx-auto text-6xl font-bold drop-shadow-sm"
				:class="getFittingTextColor(firstPlace?.team.color)">
				<h2 class="">
					{{ firstPlace?.team.name }}
				</h2>
				<h2 class="text-4xl">Score: ${{ firstPlace?.team.points }}</h2>
			</div>
		</div>
		<h2 class="text-3xl font-bold">Scores:</h2>

		<div class="grid grid-rows-2 grid-flow-col gap-y-8">
			<div
				v-for="result in resultsList"
				class="flex flex-row gap-4 border-4 border-black rounded w-64 px-4 py-2"
				:style="{ backgroundColor: result.team.color || '#eab308' }">
				<h1
					class="text-6xl font-bold drop-shadow-md my-auto"
					style="-webkit-text-stroke: 2px black"
					:style="{
						color:
							result.placement === 1
								? '#ffc60a'
								: result.placement === 2
								? '#858585'
								: result.placement === 3
								? '#92400e'
								: '#0818d2', // fallback color
					}">
					{{ result.placement }}
				</h1>
				<div :class="getFittingTextColor(result.team.color)">
					<h2 class="text-2xl font-semibold">
						{{ result.team.name }}
					</h2>
					<p class="text-xl font-medium">${{ result.team.points }}</p>
				</div>
			</div>
		</div>
		<client-only>
			<NuxtLink
				to="/"
				@click="resetGame()"
				class="text-lg font-semibold border-2 border-black rounded-full cursor-pointer px-4 py-2 mt-20 mx-auto bg-sky-400 hover:bg-sky-500">
				<button class="">Back to Menu</button>
			</NuxtLink>
		</client-only>
	</div>
</template>

<script lang="ts" setup>
import type { Team } from "~/models/team";

const teamStore = useTeamStore();

const resultsList = ref<teamResults[]>([]);
const firstPlace = computed(() => {
	return resultsList.value.find((result) => result.placement === 1);
});

type teamResults = {
	team: Team;
	placement: number;
};

const resetGame = () => {
	const gameStore = useGameStore();
	gameStore.resetBoardData();
	teamStore.resetPoints();
};

const calculateStandings = () => {
	const sortedTeams = [...teamStore.teams].sort((a, b) => b.points - a.points);

	let placement = 1;
	let lastPoints: number | null = null;
	let offset = 0;

	resultsList.value = sortedTeams.map((team, index) => {
		if (lastPoints === null || team.points !== lastPoints) {
			placement = index + 1;
		} else {
			offset++; // for ties
		}

		lastPoints = team.points;

		return {
			team,
			placement,
		};
	});
};

onMounted(() => {
	calculateStandings();
});
</script>

<style>
.text-outline {
	text-shadow: 2px 0px 0 black, -2px 0px 0 black, 0px 2px 0 black,
		0px -2px 0 black;
}
</style>
