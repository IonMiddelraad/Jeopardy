<script lang="ts" setup>
import type { Card } from "~/models/card";

const gameStore = useGameStore();
const teamStore = useTeamStore();
const chosenCard = ref<Card>();
const showBoard = ref<boolean>(true);
const dailyDoubleActive = ref<boolean>(false);
const dailyDoubleCard = ref<Card>();
const boardHeight = ref<number>(0);
const board = ref<HTMLElement | null>(null);

const answerColors = ["bg-gray-200", "bg-green-400", "bg-red-400"];
const answerColorIndices = ref<number[]>([]);

const activeCategories = computed(() => {
	const board = gameStore.boardData;
	if (!board) return [];
	let activeCatIds: string[];
	switch (gameStore.currentRound) {
		case 1:
			activeCatIds = board.settings.round1Cat;
			break;
		case 2:
			activeCatIds = board.settings.round2Cat;
			break;
		default:
			activeCatIds = [];
			break;
	}
	return board.categories.filter((cat) => activeCatIds.includes(cat.id));
});

const allCardsUnavailable = computed(() => {
	// is true when active categories have been clicked
	return (
		activeCategories.value.length > 0 &&
		activeCategories.value.every(
			(category) =>
				category.cards.length > 0 &&
				category.cards.every((card) => card.available === false)
		)
	);
});

const highestPointCard = () => {
	const highestPointCard = activeCategories.value
		.flatMap((category) => category.cards)
		.reduce((maxCard, currentCard) =>
			currentCard.points > maxCard.points ? currentCard : maxCard
		);

	return highestPointCard.points;
};

const goNextRound = () => {
	chosenCard.value = undefined;
	if (gameStore.currentRound === 1) {
		gameStore.currentRound = 2;

		if (gameStore.boardData?.settings.round2Cat.length === 0) {
			goNextRound();
		}
		return;
	}
	if (gameStore.currentRound === 2) {
		if (gameStore.boardData?.settings.finalJep.enable) {
			gameStore.currentRound = 0;
		} else {
			navigateTo("/results");
		}
		return;
	}
	gameStore.currentRound = 0;
};

function handleCardClick(clickedCard: Card) {
	if (!clickedCard.available) return;
	else if (clickedCard.dailyDouble) {
		dailyDoubleCard.value = clickedCard;
		dailyDoubleActive.value = true;
	}
	chosenCard.value = clickedCard;
	if (gameStore.currentRound === 2) {
	}

	toggleBoard();
}

function toggleBoard() {
	if (showBoard.value) {
		boardHeight.value = board.value?.scrollHeight || 0;
		requestAnimationFrame(() => {
			boardHeight.value = 0;
			showBoard.value = false;
		});
	} else {
		showBoard.value = true;
		nextTick(() => {
			boardHeight.value = board.value?.scrollHeight || 0;
		});
	}
}

function nextQuestion() {
	disableCurrentCard();
	chosenCard.value = undefined;
	dailyDoubleCard.value = undefined;

	dailyDoubleActive.value = false;
	toggleBoard();
}

function disableCurrentCard() {
	if (chosenCard.value) {
		chosenCard.value.available = false;
	}
}

onMounted(async () => {
	answerColorIndices.value = teamStore.teams.map(() => 0);
	if (showBoard.value) {
		await nextTick();
		boardHeight.value = board.value?.scrollHeight || 0;
	}
});
</script>

<template>
	<div
		v-motion-fade
		class="mx-auto select-none">
		<!-- grid with category columns -->
		<ClientOnly>
			<div
				ref="boardWrapper"
				class="overflow-hidden transition-[max-height] duration-500 ease-in-out"
				:style="{ maxHeight: showBoard ? boardHeight + 'px' : '0px' }">
				<div
					class="grid mx-4"
					:class="`grid-cols-${Math.min(activeCategories.length, 12)}`"
					ref="board">
					<div
						v-for="category in activeCategories"
						:key="category.id"
						class="p-4 flex flex-col items-center">
						<h1 class="text-xl font-bold text-center mb-2">
							{{ category.name }}
						</h1>

						<!-- cards in columns -->
						<div class="flex flex-col gap-2 w-full">
							<p
								v-for="(card, index) in category.cards"
								:key="index"
								class="bg-blue-400 text-center p-2"
								:class="[
									card.available
										? 'cursor-pointer hover:bg-blue-500'
										: 'cursor-default opacity-50',
								]"
								@click="handleCardClick(card)">
								${{
									gameStore.currentRound === 2 ? card.points * 2 : card.points
								}}
							</p>
						</div>
					</div>
				</div>
			</div>
		</ClientOnly>
		<div
			v-if="activeCategories.length > 0"
			class="flex mx-4">
			<button
				class="border-2 border-black rounded-full w-3/5 mt-1 mx-auto"
				@click="toggleBoard">
				<Icon
					icon="ion:chevron-down"
					class="h-8 w-10 transform transition-transform mx-auto"
					:class="{ 'rotate-180': showBoard }" />
			</button>
		</div>

		<!-- question and answer -->
		<section v-if="!dailyDoubleActive">
			<QuestionComponent
				v-if="chosenCard"
				:question="chosenCard.question"
				:points="chosenCard.points"
				:answer="chosenCard.answer"
				@next="nextQuestion"
				@disable-question="disableCurrentCard"></QuestionComponent>
		</section>

		<!-- Next round -->
		<section
			v-if="allCardsUnavailable && !chosenCard"
			class="mt-4">
			<div
				class="cursor-pointer text-lg font-medium border-2 border-black rounded-full w-48 h-12 p-2 m-auto hover:bg-gray-100"
				@click="goNextRound()">
				<div class="flex gap-x-2 p-auto justify-center">
					<h2>Next Round</h2>
					<Icon
						icon="material-symbols:arrow-right-alt-rounded"
						height="30"
						width="30"
						class="my-auto" />
				</div>
			</div>
		</section>
		<!-- Final round -->
		<ClientOnly>
			<section v-if="activeCategories.length === 0">
				<div>
					<WagerComponent mode="final-jeopardy"></WagerComponent>
				</div>
			</section>
		</ClientOnly>
		<!-- Daily double -->
		<section v-if="dailyDoubleActive">
			<div>
				<WagerComponent
					mode="daily-double"
					:highest-round-points="highestPointCard()"
					:daily-double-card="dailyDoubleCard"
					@next="nextQuestion"></WagerComponent>
			</div>
		</section>
	</div>
</template>
