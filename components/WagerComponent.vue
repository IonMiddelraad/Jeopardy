<template>
  <div>
    <section v-if="props.mode === 'final-jeopardy' ">
      <div
        class="cursor-pointer text-lg font-medium border-2 border-black rounded w-64 h-48 p-2 m-auto hover:bg-gray-100">
        <div class="gap-x-2 p-auto justify-center">
          <h2>How much will you wager?</h2>
          <input type="number" class="p-2 pl-4 border border-black rounded-full"/>
        </div>
      </div>
    </section>
    <section v-if="props.mode === 'daily-double'">

    </section>

  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  mode: "daily-double" | "final-jeopardy"
}>()

const dailyDouble = ref<boolean>(true);

const gameStore = useGameStore();
</script>