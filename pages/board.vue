<script lang="ts" setup>
import type { Card } from '~/models/card';

const boardStore = useMyBoardStore();
const teamStore = useTeamStore();
const chosenCard = ref<Card>();
const showAnswer = ref<boolean>(false);

const teamColors = ['bg-gray-200', 'bg-green-400', 'bg-red-400'];
const colorIndices = ref<number[]>([]);

function handleCardClick(clickedCard: Card) {
  if (!clickedCard.available) return;
  showAnswer.value = false;
  colorIndices.value = colorIndices.value.map(() => 0)
  chosenCard.value = clickedCard;
}

function toggleAnswer(clickedCard: Card) {
  clickedCard.available = false
  showAnswer.value = !showAnswer.value;
}

function cycleColor(index: number, teamId: number, pointAmount: number) {
  const current = colorIndices.value[index];
  colorIndices.value[index] = (current + 1) % teamColors.length;
  if (colorIndices.value[index] <= 1) {
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
  }
  colorIndices.value = teamStore.teams.map(() => 0)
})
</script>

<template>
  <div class="mx-auto select-none">

    <!-- grid with category columns -->
    <ClientOnly>

      <div class="grid grid-cols-5 mx-4">
        <div v-for="(category, index) in boardStore.boardData?.categories" :key="index"
          class=" p-4 flex flex-col items-center">


          <h1 class="text-xl font-bold text-center mb-2">{{ category.name }}</h1>

          <!-- cards in columns -->
          <div class="flex flex-col gap-2 w-full">
            <p v-for="(card, index) in category.cards" :key="index" class="bg-blue-400 text-center p-2 cursor-pointer"
              :class="{ 'opacity-50 cursor-default': !card.available }" @click="handleCardClick(card)">
              ${{ card.points }}
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- question and answer -->
    <section v-if="chosenCard">
      <div class="flex flex-col items-center mt-4 pt-2 pb-8 mb-4 gap-y-2 ">
        <h2 class="font-semibold text-xl">${{ chosenCard?.points }}</h2>
        <h1 class="font-semibold text-3xl pb-4 mb-4">{{ chosenCard?.question }}</h1>

        <h2 v-if="showAnswer" class="font-bold text-3xl">{{ chosenCard?.answer }}</h2>
        <button v-if="!showAnswer"
          class="text-lg font-semibold border-2 border-black rounded-full cursor-pointer px-4 py-2 hover:bg-gray-100"
          @click="toggleAnswer(chosenCard)">Reveal Answer</button>

      </div>
    </section>
    <!-- Giving points -->
    <section>
      <div v-if="showAnswer && chosenCard" class="flex flex-row gap-x-4 justify-center mt-8">
        <div v-for="(team, index) in teamStore.teams" :key="index" class="text-center w-56">
          <h1 class="text-lg font-semibold border-2 border-black rounded-full cursor-pointer px-4 py-2"
            :class="getColorClass(index)" @click="cycleColor(index, team.id, chosenCard.points)">{{ team.name }}</h1>
        </div>
      </div>
    </section>
  </div>
</template>
