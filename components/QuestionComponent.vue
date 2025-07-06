<template>
	<div>
		<!-- question -->
		<div v-if="question">
			<div
				v-motion-pop-visible
				class="flex flex-col text-center items-center mt-4 pt-2 pb-8 mb-4 gap-y-2">
				<h2
					v-show="!wagers"
					class="font-semibold text-xl">
					${{ points }}
				</h2>
				<h1 class="font-semibold text-3xl pb-4 mb-4 w-3/5">
					{{ question }}
				</h1>

				<h2
					v-motion-fade
					v-if="showAnswer"
					class="font-bold text-3xl w-3/5">
					{{ answer }}
				</h2>
				<button
					v-if="!showAnswer"
					class="text-lg font-semibold border-2 border-black rounded-full cursor-pointer px-4 py-2 hover:bg-gray-100"
					@click="toggleAnswer()">
					Reveal Answer
				</button>
			</div>
		</div>

		<!-- points -->
		<section class="flex flex-col gap-8">
			<client-only>
				<div
					v-motion-fade
					v-if="showAnswer"
					class="flex flex-row gap-x-4 justify-center mt-8">
					<div
						v-for="(team, index) in teamStore.teams"
						:key="index"
						class="text-center w-56">
						<h1
							class="text-lg font-semibold border-2 border-black rounded-full cursor-pointer px-4 py-2"
							:class="getColorClass(index)"
							@click="cycleColor(index, team.id, wagers ?? points ?? 0)">
							{{ team.name }}
						</h1>
					</div>
				</div>
				<div
					v-motion-fade
					v-if="showAnswer"
					@click="nextQuestion()"
					class="flex justify-center text-lg font-semibold border-2 border-black rounded-full cursor-pointer w-36 px-4 py-2 mx-auto bg-sky-400 hover:bg-sky-500">
					<button class="">Next</button>
					<Icon
						icon="material-symbols:arrow-right-alt-rounded"
						height="30"
						width="30"
						class="my-auto" />
				</div>
			</client-only>
		</section>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	question: string;
	answer: string;
	points?: number;
	wagers?: WagerEntry[];
}>();

const emit = defineEmits<{
	(e: "next"): void;
	(e: "disableQuestion"): void;
}>();

type WagerEntry = {
	wager: number;
	teamID: number;
};

watch(
	() => props.answer,
	() => {
		showAnswer.value = false;
	}
);

const teamStore = useTeamStore();
const gameStore = useGameStore();

const answerColorIndices = ref<number[]>([]);
const answerColors = ["bg-gray-200", "bg-green-400", "bg-red-400"];
const showAnswer = ref<boolean>(false);

const nextQuestion = () => {
	emit("next");
};

function toggleAnswer() {
	showAnswer.value = true;
	emit("disableQuestion");
}

function getColorClass(index: number) {
	return answerColors[answerColorIndices.value[index]];
}

function cycleColor(
	index: number,
	teamID: number,
	pointAmount: number | WagerEntry[]
) {
	let points: number;
	if (Array.isArray(pointAmount)) {
		const wagerEntry = pointAmount.find(
			(wagerEntry) => wagerEntry.teamID === teamID
		);
		points = wagerEntry?.wager ?? 0;
	} else if (gameStore.currentRound === 2) {
		points = pointAmount * 2;
	} else {
		points = pointAmount;
	}

	const current = answerColorIndices.value[index];
	answerColorIndices.value[index] = (current + 1) % answerColors.length;

	if (answerColorIndices.value[index] <= 1) {
		teamStore.updateTeamPoints(teamID, points);
	} else if (answerColorIndices.value[index] == 2) {
		pointAmount = points * 2;
		teamStore.updateTeamPoints(teamID, -pointAmount);
	}
}

onMounted(() => {
	answerColorIndices.value = teamStore.teams.map(() => 0);
});
</script>

<style></style>
