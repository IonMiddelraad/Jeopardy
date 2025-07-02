<script lang="ts" setup>
import type { Board } from '~/models/board';
import type { Category } from '~/models/category';

const props = defineProps<{
  board?: Board
}>()
const emit = defineEmits(['close'])

if (!props.board) {
  throw new Error('EditBoard: board prop is required');
}

const gameStore = useGameStore();
const showCategoryEditModal = ref<Category>();

const editingBoard = reactive({
  id: props.board.id ?? '' as string,
  name: props.board.name ?? '' as string,
  categories: props.board?.categories ? [...props.board.categories] : [] as Category[],
  settings: { ...props.board.settings },
})

const roundChanged = (id: string, setRound: number) => {
  editingBoard.settings.round1Cat = editingBoard.settings.round1Cat.filter((existingId: string) => existingId !== id)
  editingBoard.settings.round2Cat = editingBoard.settings.round2Cat.filter((existingId: string) => existingId !== id)
  switch (setRound) {
    case 1:
      editingBoard.settings.round1Cat.push(id);
      break;
    case 2:
      editingBoard.settings.round2Cat.push(id);
      break;
    default:
      break;
  }
}

const addCategory = () => {
  if (editingBoard.categories.length < 10) {
    editingBoard.categories.push({
      id: `cat-${Date.now()}-${editingBoard.categories.length}`,
      name: "New Category",
      cards: []
    })
  }
}

const editCategory = (index: number) => {
  if (editingBoard.categories[index] === showCategoryEditModal.value) {
    showCategoryEditModal.value = undefined;
  } else {
    showCategoryEditModal.value = editingBoard.categories[index];
  }
}

const deleteCategory = (index: number) => {
  editingBoard.settings.round1Cat = editingBoard.settings.round1Cat.filter((existingId: string) => existingId !== editingBoard.categories[index].id)
  editingBoard.settings.round2Cat = editingBoard.settings.round2Cat.filter((existingId: string) => existingId !== editingBoard.categories[index].id)
  editingBoard.categories.splice(index, 1);
}

const updateCategory = (updatedCategory: Category) => {
  let index = editingBoard.categories.findIndex((category) => category.id === updatedCategory.id);
  editingBoard.categories.splice(index, 1, updatedCategory);
}

const addCategoryToStore = (category: Category) => {
  if (gameStore.categories.includes(category)) {
    return
  } else {
    gameStore.categories.push(category);
  }
}

const saveBoard = () => {
  let index = gameStore.boards.findIndex((board) => board.id === editingBoard.id);
  gameStore.boards.splice(index, 1, editingBoard);
  emit("close")
  // resetBoard();
}

const resetBoard = () => {
  editingBoard.id = '';
  editingBoard.name = '';
  editingBoard.categories = [];
  editingBoard.settings = {
    dailyDouble: false,
    finalJep: { enable: false },
    round1Cat: [],
    round2Cat: []
  };
  emit("close")
}
</script>

<template>
  <div v-if="board">
    <form @submit.prevent="saveBoard" class="flex flex-col gap-y-3">
      <div>
        <label for="name" class="font-medium text-lg">Board Name</label>
        <input v-model="editingBoard.name" id="name" type="text" required class="w-full border rounded p-2">
      </div>
      <ToggleSwitch v-model="editingBoard.settings.dailyDouble" label="Daily Double"></ToggleSwitch>
      <ToggleSwitch v-model="editingBoard.settings.finalJep.enable" label="Final Jeopardy (Final Round)"></ToggleSwitch>
      <div v-if="editingBoard.settings.finalJep.enable">
        <label for="finalQuestion" class="font-medium">Final Round Question</label>
        <input id="finalQuestion" v-model="editingBoard.settings.finalJep.question" type="text" required
          class="w-full border rounded p-2">
        <label for="finalAnswer" class="font-medium">Final Round Answer</label>
        <input id="finalAnswer" v-model="editingBoard.settings.finalJep.answer" type="text" required
          class="w-full border rounded p-2">
      </div>
      <div>

        <!-- category list -->
        <h2 class="text-xl font-semibold">Categories</h2>

        <div v-for="(category, index) in editingBoard.categories" class="">
          <div class="grid grid-cols-[4fr_1fr_1fr_1fr_2fr_1fr] gap-x-2 my-2 mx-auto h-auto rounded bg-gray-100">
            <div class="my-auto px-2 cursor-default">
              <h3 class="font-medium">{{ category.name }}</h3>
            </div>

            <!-- icons -->
            <div class="cursor-pointer m-auto" title="Add to all Categories">
              <Icon icon="material-symbols:arrow-upward-rounded" width="25" height="25"
                @click="addCategoryToStore(category)" />
            </div>
            <div class="cursor-pointer m-auto" title="Download as JSON">
              <Icon icon="material-symbols:download-rounded" width="25" height="25" @click="exportItem(category)" />
            </div>
            <div class="cursor-pointer m-auto" title="Edit Categroy">
              <Icon icon="material-symbols:edit-square-outline" width="25" height="25" @click="editCategory(index)" />
            </div>


            <!-- Round Selection -->
            <div class="flex flex-col m-auto" title="Select when the Category will show">
              <div>
                <input type="radio" :name="category.id + 'Round'" :id="category.id + 'Round1'" value="Round 1"
                  @change="roundChanged(category.id, 1)" class="accent-blue-500 cursor-pointer"
                  :checked="editingBoard.settings.round1Cat.includes(category.id)"
                  :disabled="editingBoard.settings.round1Cat.length >= 5 && !editingBoard.settings.round1Cat.includes(category.id)">
                <label :for="category.id + 'Round1'" class="cursor-pointer">Round 1</label>
              </div>
              <div class="cursor-pointer">
                <input type="radio" :name="category.id + 'Round'" :id="category.id + 'Round2'" value="Round 2"
                  @change="roundChanged(category.id, 2)" class="accent-blue-500 cursor-pointer"
                  :checked="editingBoard.settings.round2Cat.includes(category.id)"
                  :disabled="editingBoard.settings.round2Cat.length >= 5 && !editingBoard.settings.round2Cat.includes(category.id)">
                <label :for="category.id + 'Round2'" class="cursor-pointer">Round 2</label>
              </div>
              <div class="cursor-pointer">
                <input type="radio" :name="category.id + 'Round'" :id="category.id + 'Random'" value="Random"
                  @change="roundChanged(category.id, 0)" class="accent-blue-500 cursor-pointer"
                  :checked="!editingBoard.settings.round1Cat.includes(category.id) && !editingBoard.settings.round2Cat.includes(category.id)">
                <label :for="category.id + 'Random'" class="cursor-pointer">Random</label>
              </div>

            </div>
            <div class="cursor-pointer m-auto" title="Delete Category">
              <Icon icon="ion:trash" width="25" height="25" @click="deleteCategory(index)" />
            </div>


          </div>

          <EditCategory v-if="showCategoryEditModal === category" :category="showCategoryEditModal"
            @close="showCategoryEditModal = undefined" @update="updateCategory">
          </EditCategory>
        </div>
        <div v-show="editingBoard.categories.length < 10" class="flex gap-x-1 cursor-pointer " @click="addCategory()">
          <label for="addCat" class="font-medium text-sm cursor-pointer">Add Category</label>
          <Icon icon="material-symbols:add-2-rounded" width="18" height="18" id="addCat" class="my-auto" />
        </div>
      </div>
      <div class="flex gap-x-4 border-t py-2">
        <button type="submit"
          class="bg-green-600 text-white font-medium w-28 py-2 border border-black rounded hover:bg-green-700">
          Save Board
        </button>
        <button type="button" @click="resetBoard()"
          class="bg-red-600 text-white font-medium w-28 py-2 border border-black rounded hover:bg-red-700">
          Cancel
        </button>
      </div>

    </form>

  </div>
</template>