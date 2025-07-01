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

const editCategory = (index: number) => {

}

const deleteCategory = (index: number) => {
  editingBoard.categories.splice(index, 1);
}

const saveBoard = () => {
  console.log(editingBoard)
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

        <div v-for="(category, index) in editingBoard.categories"
          class="grid grid-cols-[4fr_2fr_2fr_1fr] gap-x-2 py-2 my-2 mx-auto h-auto rounded bg-gray-100">

          <div class="my-auto px-2 cursor-default">
            <h3 class="font-medium">{{ category.name }}</h3>
          </div>

          <Icon icon="ion:settings-outline" width="20" height="20" @click="editCategory(index)"
            class="cursor-pointer m-auto" />

          <!-- Round Selection -->
          <div class="flex flex-col m-auto">
            <div>
              <input type="radio" :name="category.id + 'Round'" :id="category.id + 'Round1'" value="Round 1"
                @change="roundChanged(category.id, 1)" class="accent-blue-500"
                :checked="editingBoard.settings.round1Cat.includes(category.id)">
              <label :for="category.id + 'Round1'">Round 1</label>
            </div>
            <div>
              <input type="radio" :name="category.id + 'Round'" :id="category.id + 'Round2'" value="Round 2"
                @change="roundChanged(category.id, 2)" class="accent-blue-500"
                :checked="editingBoard.settings.round2Cat.includes(category.id)">
              <label :for="category.id + 'Round2'">Round 2</label>
            </div>
            <div>
              <input type="radio" :name="category.id + 'Round'" :id="category.id + 'Random'" value="Random"
                @change="roundChanged(category.id, 0)" class="accent-blue-500"
                :checked="!editingBoard.settings.round1Cat.includes(category.id) && !editingBoard.settings.round2Cat.includes(category.id)">
              <label :for="category.id + 'Random'">Random</label>
            </div>

          </div>
          <Icon icon="ion:trash" width="20" height="20" @click="deleteCategory(index)" class="cursor-pointer m-auto" />
        </div>

      </div>
      <div class="flex gap-x-4">
        <button type="submit"
          class="bg-green-600 text-white font-medium px-6 py-2 border border-black rounded hover:bg-green-700">
          Save
        </button>
        <button type="button" @click="resetBoard()"
          class="bg-red-600 text-white font-medium px-6 py-2 border border-black rounded hover:bg-red-700">
          Cancel
        </button>
      </div>

    </form>

  </div>
</template>