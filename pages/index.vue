<script setup lang="ts">
const boardStore = useMyBoardStore();

function resetBoard() {
  boardStore.fetchBoard();
}

function startGame() {

}
</script>

<template>
  <div class=mx-auto>
    <section class="text-center items-center">
      <h1 class="text-3xl font-bold ">
       Jeopardy!
      </h1>
      <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 self-end" @click="resetBoard()">
        Reset
      </button>
      
        <NuxtLink to="/board">
          <button type="button" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 self-end">
            Start
          </button>
        </NuxtLink>
      
    </section>

  </div>
</template>
