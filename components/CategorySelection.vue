<script lang="ts" setup>
import type { Board } from '~/models/board';
import type { Category } from '~/models/category';

const props = defineProps<{
  categoryList: Category[]
}>()

const gameStore = useGameStore();
const showEditCategory = ref<Category>();

const newBoard = reactive({
  categories: [] as Category[],
})

const selectedCategoryIds = computed({
  get() {
    return newBoard.categories.map(cat => cat.id)
  },
  set(newIds: string[]) {
    newBoard.categories = props.categoryList.filter(cat => newIds.includes(cat.id))
  }
})

const isSelected = (id: string) => { return newBoard.categories.some((c) => c.id === id) }

const editCategory = (index: number) => {
  if (gameStore.categories[index] === showEditCategory.value) {
    showEditCategory.value = undefined;
  } else {
    showEditCategory.value = gameStore.categories[index];
  }
}

const deleteCategory = (index: number) => {
  gameStore.categories.splice(index, 1)
}

const updateCategory = (updatedCategory: Category) => {
  let index = gameStore.categories.findIndex((category) => category.id === updatedCategory.id);
  gameStore.categories.splice(index, 1, updatedCategory)
}

const createBoard = () => {
  if (!Array.isArray(newBoard.categories) || !newBoard.categories.length) {
    console.error("Could not create Board, Categories is empty!")
    return
  }
  let createdBoard: Board = {
    id: `brd-${Date.now()}`,
    name: newBoard.categories[0].name,
    categories: newBoard.categories,
    settings: {
      dailyDouble: false,
      finalJep: {
        enable: false
      },
      round1Cat: [],
      round2Cat: []
    }
  }
  gameStore.boards.push(createdBoard)
  resetNewBoard()
}

function resetNewBoard() {
  newBoard.categories = [];
}

function toggleCategory(category: Category) {
  const index = newBoard.categories.findIndex((c) => c.id === category.id)
  if (index > -1) {
    newBoard.categories.splice(index, 1)
  } else if (newBoard.categories.length < 10) {
    // Add with default round
    newBoard.categories.push(category)
  }
}

function getCategoryById(id: string) {
  return newBoard.categories.find((c) => c.id === id) as Category & { round: string }
}

</script>

<template>
  <div>
    <h2 class="text-xl font-semibold">Categories</h2>

    <div v-for="(category, index) in categoryList"
      class="grid grid-cols-[6fr_1fr_1fr_1fr] gap-x-2 py-2 my-2 mx-auto h-auto rounded bg-gray-100">
      <div class="my-auto px-2 font-medium">
        <input type="checkbox" :id="category.id" class="accent-green-600"
          :disabled="!isSelected(category.id) && newBoard.categories.length >= 10" v-model="selectedCategoryIds"
          :value="category.id" />
        <label :for="category.id">{{ category.name }}</label>
      </div>

      <Icon icon="ion:download-outline" width="20" height="20" @click="exportItem(category)"
        class="cursor-pointer m-auto" />
      <Icon icon="ion:settings-outline" width="20" height="20" @click="editCategory(index)"
        class="cursor-pointer m-auto" />

      <Icon icon="ion:trash" width="20" height="20" @click="deleteCategory(index)" class="cursor-pointer m-auto" />

      <Modal :show="showEditCategory === category" width="75%" :can-close="false" @close="showEditCategory = undefined" class="">
        <EditCategory :category="category" @close="showEditCategory = undefined" @update="updateCategory"></EditCategory>
      </Modal>
    </div>
    <button type="submit" @click="createBoard()"
      class="bg-green-600 text-white px-6 py-2 border border-black rounded hover:bg-green-700">
      Create Board
    </button>

  </div>
</template>