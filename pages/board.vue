<script lang="ts" setup>
import type { Card } from '~/models/card';

const boardStore = useMyBoardStore();
const teamStore = useTeamStore();
const activeCard = ref<boolean>(false);
const chosenCard = ref<Card>();
const showAnswer = ref<boolean>(false);

const teamColors = ['bg-gray-200', 'bg-green-400', 'bg-red-400'];
const colorIndices = ref<number[]>([]);

function handleCardClick(clickedCard: Card) {
  showAnswer.value = false;
  colorIndices.value = colorIndices.value.map(() => 0)
  chosenCard.value = clickedCard;
  activeCard.value = true;
}

function toggleAnswer() {
  showAnswer.value = !showAnswer.value;
}

function cycleColor(index: number, teamId: number, pointAmount: number) {
  const current = colorIndices.value[index];
  colorIndices.value[index] = (current + 1) % teamColors.length;
  if (colorIndices.value[index] <= 1 ) {
    teamStore.updateTeamPoints(teamId, pointAmount);

  } else if (colorIndices.value[index] == 2) {
    pointAmount = pointAmount * 2;
    teamStore.updateTeamPoints(teamId, -pointAmount);
  }
}

function getColorClass(index: number) {
  return teamColors[colorIndices.value[index]]
}

onMounted(async () => {
  if (!boardStore.boardData) {
    await boardStore.fetchBoard();
    colorIndices.value = teamStore.teams.map(() => 0)
  }
})
</script>

<template>
  <div class="mx-auto">

    <!-- grid with category columns -->
    <div class="grid grid-cols-5">
      <div v-for="(category, index) in boardStore.boardData?.categories" :key="index"
        class="border p-4 flex flex-col items-center">
        <h1 class="text-xl font-bold text-center mb-2">{{ category.name }}</h1>

        <!-- cards in columns -->
        <div class="flex flex-col gap-2 w-full">
          <p v-for="(card, index) in category.cards" :key="index"
            class="bg-blue-400 text-center p-2 w-full cursor-pointer" @click="handleCardClick(card)">
            {{ card.points }}
          </p>
        </div>
      </div>
    </div>
    <!-- Answer -->
    <section v-if="activeCard">
      <div class="flex flex-col items-center mt-5">
        <h2 class="font-semibold text-xl">for {{ chosenCard?.points }} Points</h2>
        <h1 class="font-bold text-3xl mb-4">{{ chosenCard?.question }}</h1>

        <h2 v-if="showAnswer" class="font-semibold text-2xl">{{ chosenCard?.answer }}</h2>
        <button v-if="!showAnswer" @click="toggleAnswer()">Show answer</button>

      </div>
    </section>
    <!-- Giving points -->
    <section>
      <div v-if="showAnswer && chosenCard" class="flex flex-row gap-x-8 justify-center">
        <div v-for="(team, index) in teamStore.teams" :key="index" class="text-center min-w-56">
          <h1 class="text-lg font-semibold border-2 border-black rounded-full cursor-pointer px-4 py-2" :class="getColorClass(index)"
            @click="cycleColor(index, team.id, chosenCard.points)">{{ team.name }}</h1>
        </div>
      </div>
    </section>
  </div>
</template>
