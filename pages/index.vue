<script setup lang="ts">
import type { Board } from '~/models/board';
import type { Category } from '~/models/category';


const gameStore = useGameStore();
const teamStore = useTeamStore();
const importErrorMessage = ref<string>("");
const showBoardEditModal = ref<boolean>(false);
const selectedBoard = ref<Board>()

function resetBoard() {
  gameStore.fetchBoard();
  teamStore.resetPoints();
}

const deleteBoard = (index: number) => {
  gameStore.boards.splice(index, 1)
}

const editBoard = (boardIndex: number) => {
  selectedBoard.value = gameStore.boards[boardIndex];
  showBoardEditModal.value = true;
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
        board.id = `brd-${Date.now()}-${gameStore.boards.length}`
        gameStore.boards.push(board)
      } else if ('cards' in json) {
        // Detected as a single Category
        const category = json as Category
        category.id = `cat-${Date.now()}-${gameStore.categories.length}`
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
          <CategorySelection :category-list="gameStore.categories"></CategorySelection>
        </div>
        <!-- Boards -->
        <div>
          <h2 class="text-xl font-semibold mt-4">Boards</h2>
          <div v-for="(board, index) in gameStore.boards"
            class="grid grid-cols-[6fr_1fr_1fr_1fr] gap-x-2 my-2 mx-auto min-h-12 h-auto rounded bg-gray-100">
            <div class="my-auto px-2 font-medium">
              <input type="checkbox" :id="board.id" class="accent-green-600">
              <label :for="board.id">{{ board.name }}</label>
            </div>
            
            <Icon icon="ion:download-outline" width="20" height="20" @click="exportItem(board)"
              class="cursor-pointer m-auto" />
            <Icon icon="ion:settings-outline" width="20" height="20" @click="editBoard(index)"
              class="cursor-pointer m-auto" />

            <Icon icon="ion:trash" width="20" height="20" @click="deleteBoard(index)" class="cursor-pointer m-auto" />
          </div>
        </div>

      </div>
    </section>
    <Modal :show="showBoardEditModal" :can-close="false" @close="showBoardEditModal = false" class="">
      <EditBoard :board="selectedBoard" @close="showBoardEditModal = false"></EditBoard>
    </Modal>
  </div>
</template>
