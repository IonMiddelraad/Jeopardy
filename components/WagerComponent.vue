<template>
	<div>
		<div>
			<section v-if="props.mode === 'final-jeopardy'">
				<h1
					v-motion-pop-visible-once
					class="text-5xl font-bold text-center my-10">
					Final Jeopardy!
				</h1>
				<form
					@submit.prevent="sendWager"
					v-if="inputWagers"
					class="flex flex-col gap-y-10">
					<button
						type="submit"
						class="bg-blue-500 hover:bg-blue-600 text-white font-semibold m-auto py-2 px-4 border border-black rounded cursor-pointer">
						Confirm wagers
					</button>
					<client-only>
						<div class="flex flex-row justify-evenly">
							<div
								v-for="team in teamStore.teams.filter((t) => t.points > 4)"
								class="border-2 border-black rounded w-64 h-48 p-2 m-auto">
								<div class="flex flex-col gap-y-4 p-auto justify-center">
									<div>
										<h2 class="text-xl font-bold">
											{{ team.name }}
										</h2>
										<p class="text-lg font-medium">How much will you wager?</p>
									</div>

									<input
										type="number"
										placeholder="0"
										:max="team.points"
										min="1"
										required
										class="w-full font-medium p-2 pl-4 border border-black rounded-full"
										@input="onWagerInput($event, team.id)" />
								</div>
							</div>
						</div>
					</client-only>
				</form>
			</section>
		</div>
		<section v-if="props.mode === 'daily-double'">
			<h1
				v-motion-pop-visible-once
				class="text-5xl font-bold text-center my-10">
				Daily Double!
			</h1>
			<form
				@submit.prevent="sendWager"
				v-if="inputWagers"
				class="flex flex-col gap-y-10">
				<button
					type="submit"
					class="bg-blue-500 hover:bg-blue-600 text-white font-semibold m-auto py-2 px-4 border border-black rounded cursor-pointer">
					Confirm wagers
				</button>
				<client-only>
					<div class="flex flex-row justify-evenly">
						<div
							v-for="team in teamStore.teams"
							class="border-2 border-black rounded w-64 h-48 p-2 m-auto">
							<div class="flex flex-col gap-y-4 p-auto justify-center">
								<div>
									<h2 class="text-xl font-bold">
										{{ team.name }}
									</h2>
									<p class="text-lg font-medium">How much will you wager?</p>
								</div>

								<input
									type="number"
									placeholder="5"
									required
									class="w-full font-medium p-2 pl-4 border border-black rounded-full"
									@input="onWagerInput($event, team.id)" />
							</div>
						</div>
					</div>
				</client-only>
			</form>
		</section>
		<!-- question, answer and points -->
		<section v-if="wagersDone">
			<QuestionComponent
				v-if="mode === 'final-jeopardy'"
				:question="gameStore.boardData?.settings.finalJep.question!"
				:answer="gameStore.boardData?.settings.finalJep.answer!"
				:wagers="wagers"
				@next="goNext()"></QuestionComponent>

			<QuestionComponent
				v-if="mode === 'daily-double'"
				:question="dailyDoubleCard?.question!"
				:answer="dailyDoubleCard?.answer!"
				:wagers="wagers"
				@next="goNext()"></QuestionComponent>
		</section>
	</div>
</template>

<script lang="ts" setup>
import type { Card } from "~/models/card";

const props = defineProps<{
	mode: "daily-double" | "final-jeopardy";
	highestRoundPoints?: number | undefined;
	dailyDoubleCard?: Card;
}>();

const emit = defineEmits<{
	(e: "next"): void;
}>();

type WagerEntry = {
	wager: number;
	teamID: number;
};

const teamStore = useTeamStore();
const inputWagers = ref(true);
const showAnswer = ref(false);
const wagersDone = ref(false);
const wagers = ref<WagerEntry[]>([]);
const answerColorIndices = ref<number[]>([]);
const answerColors = ["bg-gray-200", "bg-green-400", "bg-red-400"];

const gameStore = useGameStore();

function onWagerInput(event: Event, teamID: number) {
	const target = event.target as HTMLInputElement;
	const value = Number(target.value);

	const team = teamStore.teams.find((t) => t.id === teamID);
	if (!team) return;
	const maxTeamPoints = team.points;

	if (props.mode === "final-jeopardy") {
		if (isNaN(value) || value < 0 || value > maxTeamPoints) {
			// Optionally show error feedback
			target.setCustomValidity(
				value < 0
					? "Wager cannot be negative"
					: value > maxTeamPoints
					? `Wager cannot exceed your point total`
					: "Invalid number"
			);
			target.reportValidity();
			return;
		}
	} else if (props.mode === "daily-double") {
		const maxPoints = Math.max(team.points, props.highestRoundPoints ?? 5);
		if (isNaN(value) || value < 5 || value > maxPoints) {
			// Optionally show error feedback
			target.setCustomValidity(
				value < 5
					? "Wager must be 5 or higher"
					: value > maxPoints
					? `Wager cannot exceed ${maxPoints}`
					: "Invalid number"
			);
			target.reportValidity();
			return;
		}
	}

	target.setCustomValidity(""); // Clear previous error
	setWager(value, teamID);
}

const sendWager = () => {
	inputWagers.value = false;
	wagersDone.value = true;
};

const setWager = (wager: number, teamID: number) => {
	const existing = wagers.value.find((entry) => entry.teamID === teamID);
	if (existing) {
		existing.wager = wager;
	} else {
		wagers.value.push({ wager, teamID });
	}
};

const goNext = () => {
	if (props.mode === "final-jeopardy") {
		navigateTo("/results");
	} else {
		emit("next");
	}
};

onMounted(() => {
	answerColorIndices.value = teamStore.teams.map(() => 0);
});
</script>
