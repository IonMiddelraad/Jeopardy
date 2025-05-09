<script lang="ts" setup>
import type { Card } from '~/models/card';

const boardStore = useMyBoardStore();
const teamStore = useTeamStore();
const activeCard = ref<boolean>(false);
const chosenCard = ref<Card>();
const showAnswer = ref<boolean>(false);

function handleCardClick(clickedCard: Card) {
  showAnswer.value = false;
  chosenCard.value = clickedCard;
  activeCard.value = true;
  teamStore.currentActivePoints = chosenCard.value.points;
  teamStore.toggleCanChangeScore(showAnswer.value);
}

function toggleAnswer() {
  showAnswer.value = !showAnswer.value;
  teamStore.toggleCanChangeScore(showAnswer.value);
}

onMounted(async () => {
  if (!boardStore.boardData) {
    await boardStore.fetchBoard();
  }
})
</script>

<template>
  <div class="mx-auto">
    <TeamComponent></TeamComponent>
    <!-- Make sure this grid creates the correct number of columns -->
    <div class="grid grid-cols-5">
      <div v-for="(category, index) in boardStore.boardData?.categories" :key="index"
        class="border p-4 flex flex-col items-center">
        <h1 class="text-xl font-bold text-center mb-2">{{ category.name }}</h1>

        <!-- Ensure the questions are stacked in a column -->
        <div class="flex flex-col gap-2 w-full">
          <p v-for="(card, index) in category.cards" :key="index" class="bg-blue-400 text-center p-2 w-full cursor-pointer"
            @click="handleCardClick(card)">
            {{ card.points }}
          </p>
        </div>
      </div>
    </div>
    <section v-if="activeCard">
      <div class="flex flex-col items-center mt-5">
        <h2 class="font-semibold text-xl">for {{ chosenCard?.points }} Points</h2>
        <h1 class="font-bold text-3xl mb-4">{{ chosenCard?.question }}</h1>

        <h2 v-if="showAnswer" class="font-semibold text-2xl">{{ chosenCard?.answer }}</h2>
        <button v-if="!showAnswer" @click="toggleAnswer()">Show answer</button>

      </div>
    </section>
  </div>
</template>
