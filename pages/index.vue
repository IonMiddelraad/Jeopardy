<script setup lang="ts">
import type { Board } from '~/models/board';
import type { Category } from '~/models/category';


const gameStore = useGameStore();
const teamStore = useTeamStore();
const importErrorMessage = ref<string>("");

function resetBoard() {
  gameStore.fetchBoard();
  teamStore.resetPoints();
}

const categoryList = computed(() => {
  let tempList = gameStore.categories;
  return tempList
})

const boardList = computed(() => {
  let tempList = gameStore.boards;
  return tempList
})

const deleteCategory = () => {

}

const editCategory = () => {

}

function exportCategory(item: Category | Board) {
  const dataStr = JSON.stringify(item, null, 2); // Pretty-print JSON
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const isBoard = "categories" in item;
  const fileName = item.name?.trim()
    ? `${item.name}.json`
    : isBoard
      ? "board.json"
      : "category.json";

  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result as string)

      if ('categories' in json) {
        // Detected as a Board
        const board = json as Board
        console.log('Imported Board:', board)
        // You could update your board store here
        gameStore.boards.push(board)
      } else if ('cards' in json) {
        // Detected as a single Category
        const category = json as Category
        console.log('Imported Category:', category)
        // Example: push to category list
        gameStore.categories.push(category)
      } else {
        importErrorMessage.value = "Could not read file format"
        console.warn('Invalid JSON structure')
      }
    } catch (err) {
      importErrorMessage.value = "Error trying to read file"
      console.error('Error parsing JSON:', err)
    }
  }

  reader.readAsText(file)
}

onMounted(() => {
  const gameStore = useGameStore();
  gameStore.setCategoriesID();
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
        <h1 class="text-2xl font-semibold py-2">Create a Category</h1>
        <CreateCategory></CreateCategory>
      </div>

      <!-- select category or board -->
      <div class="">
        <div class="flex justify-between">
          <h1 class="text-2xl font-semibold py-2">Select Categories or Board</h1>
            <p v-show="importErrorMessage" class="text-red-500 font-bold">{{ importErrorMessage }}</p>
          <div class="flex flex-col my-auto">
            <!-- <input type="file" accept=".json" class="" @change="importFile" /> -->
            <input type="file" accept=".json" id="jsonUpload" @change="importFile" class="hidden" />

            <!-- Styled label that looks like a button -->
            <label for="jsonUpload"
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 border border-black rounded cursor-pointer">
              Upload JSON
            </label>
          </div>
        </div>
        <!-- Categories -->
        <div>
          <h2 class="text-xl font-semibold">Categories</h2>
          <div v-for="category in categoryList"
            class="grid grid-cols-[4fr_2fr_2fr_1fr] gap-x-2 my-2 mx-auto h-auto rounded bg-gray-100">
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
        <!-- Boards -->
        <div>
          <h2 class="text-xl font-semibold mt-4">Boards</h2>
          <div v-for="board in boardList"
            class="grid grid-cols-[4fr_2fr_2fr_1fr] gap-x-2 my-2 mx-auto min-h-12 h-auto rounded bg-gray-100">
            <div class="my-auto px-2">
              <input type="checkbox" :id="board.id">
              <label :for="board.id">{{ board.name }}</label>
            </div>
            <button class="bg-gray-400 text-white m-auto px-2 rounded hover:bg-gray-500 font-medium border border-black"
              @click="exportCategory(board)">
              export
            </button>
            <Icon icon="ion:settings-outline" width="20" height="20" @click="editCategory()"
              class="cursor-pointer m-auto" />

            <Icon icon="ion:trash" width="20" height="20" @click="deleteCategory()" class="cursor-pointer m-auto" />
          </div>
        </div>

      </div>
    </section>

  </div>
</template>
