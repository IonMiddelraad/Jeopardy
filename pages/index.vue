<script setup lang="ts">
import { useCounterStore } from '~/stores/counterStore'

const counterStore = useCounterStore()
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
    <p>Counter: {{ counterStore.count }}</p>
    <button @click="counterStore.increment">Increment</button>
  </div>
</template>
