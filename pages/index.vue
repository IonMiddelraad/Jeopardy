<script setup lang="ts">
import type { Category } from '~/models/category';


const boardStore = useMyBoardStore();
const teamStore = useTeamStore();

function resetBoard() {
  boardStore.fetchBoard();
  teamStore.resetPoints();
}

const categoryList = computed(() => {
  let tempList = boardStore.categories;
  // tempList.push
  return tempList
})

const deleteCategory = () => {

}

function exportCategory(category: Category) {
  const dataStr = JSON.stringify(category, null, 2); // Pretty-print JSON
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${category.name || "category"}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

onMounted(() => {
  const boardStore = useMyBoardStore();
  boardStore.setCategoriesID();
  console.log(boardStore.categories)
})

</script>

<template>
  <div class="mx-auto w-full">
    <!-- Start, Reset buttons -->
    <section class="text-center pb-16">
      <h1 class="text-3xl font-bold py-2">
        Jeopardy!
      </h1>
      <div class="flex flex-row justify-evenly w-[60%] mx-auto">
        <button type="button"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-28 font-medium border-2 border-black"
          @click="resetBoard()">
          Reset
        </button>

        <NuxtLink to="/board">
          <button type="button"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-28 font-medium border-2 border-black">
            Start
          </button>
        </NuxtLink>
      </div>
    </section>

    <!-- Category selection -->
    <section class="grid grid-cols-2 px-10 mx-auto gap-x-10">

      <!-- create category -->
      <div>
        <h1 class="text-2xl text-center font-semibold py-2">Create a Category</h1>
        <CreateCategory></CreateCategory>
      </div>

      <!-- select category -->
      <div class="">
        <h1 class="text-2xl text-center font-semibold py-2">Select Categories</h1>
        <div v-for="category in categoryList" class="grid grid-cols-[4fr_2fr_2fr_1fr] gap-x-2 mx-auto h-auto">
          <div class="my-auto px-2">
            <input type="checkbox" :id="category.id">
            <label :for="category.id">{{ category.name }}</label>
          </div>
          <button class="bg-gray-400 text-white m-auto px-2 rounded hover:bg-gray-500 font-medium border border-black"
            @click="exportCategory(category)">
            export
          </button>
          <div class="flex flex-col m-auto px-2">
            <div>
              <input type="radio" :name="category.id + 'Round'" :id="category.id + 'Round1'" value="Round 1">
              <label :for="category.id + 'Round1'">Round 1</label>
            </div>
            <div>
              <input type="radio" :name="category.id + 'Round'" :id="category.id + 'Round2'" value="Round 2">
              <label :for="category.id + 'Round2'">Round 2</label>
            </div>

          </div>
          <Icon icon="ion:trash" width="20" height="20" @click="deleteCategory()" class="cursor-pointer m-auto" />

        </div>
      </div>
    </section>

  </div>
</template>
