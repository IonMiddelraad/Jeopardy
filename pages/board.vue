<script lang="ts" setup>
const boardStore = useMyBoardStore();

onMounted(async () => {
  if (!boardStore.data) {
    await boardStore.fetchData();
    console.log("datalmao: ", boardStore.data)
  }
})
</script>

<template>
  <div>
    <p> {{ boardStore.data }}</p>
  </div>
</template>


