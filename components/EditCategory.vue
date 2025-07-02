<script lang="ts" setup>
import type { Category } from '~/models/category';

const props = defineProps<{
  category?: Category
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', category: Category): void
}>()

if (!props.category) {
  throw new Error('EditCategory: Category prop is required');
}

const editingCategory = reactive({
  id: props.category.id ?? '',
  name: props.category.name ?? '',
  cards: props.category.cards ?? []
})

const addQuestion = () => {
  const nextPoints = (editingCategory.cards.length + 1) * 100
  editingCategory.cards.push({
    question: '',
    answer: '',
    points: nextPoints
  })
}

function removeQuestion(index: number) {
  editingCategory.cards.splice(index, 1);
}

function saveCategory() {
  editingCategory.id = `cat-${Date.now()}`
  emit('update', editingCategory);
  emit('close');
}

function autoResize(event: Event) {
  const el = event.target as HTMLTextAreaElement;
  el.style.height = 'auto';        // reset height
  el.style.height = el.scrollHeight + 'px';  // set new height based on content
}
</script>

<template>
  <div>
    <form @submit.prevent="saveCategory" class="flex flex-col gap-y-3">

      <div class="flex flex-row justify-between">
        <div class="flex flex-col">
          <label for="name" class="font-medium text-lg">Category Name</label>
          <input v-model="editingCategory.name" id="name" type="text" required class="w-96 border rounded p-2">
        </div>
        <button type="submit"
          class="bg-green-600 text-white text-sm font-medium my-auto w-28 h-10 border border-black rounded hover:bg-green-700">
          Save Category
        </button>
      </div>
      <div>
        <h2 class="font-medium">Questions</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div v-for="(card, index) in editingCategory.cards" :key="index" class=" border p-2 rounded bg-gray-50">
            <h3 class="font-semibold mb-2">Question {{ index + 1 }}</h3>
            <textarea v-model="card.question" id="question" placeholder="Question" required
              class="w-full mb-2 p-2 border rounded resize-none overflow-hidden" rows="1" @input="autoResize($event)" />

            <textarea v-model="card.answer" id="answer" placeholder="Answer" required
              class="w-full mb-2 p-2 border rounded resize-none overflow-hidden" rows="1" @input="autoResize($event)" />

            <input v-model.number="card.points" id="points" type="number" placeholder="Points" required
              class="w-full mb-2 p-2 border rounded" />

            <button type="button" @click="removeQuestion(index)" class="text-red-500 text-sm underline">Remove</button>
          </div>
          <div class="flex flex-row gap-2 mx-auto col-span-1 lg:col-span-2">
            <button v-show="editingCategory.cards.length < 5" type="button" @click="addQuestion"
              class="bg-blue-500 text-white text-sm font-medium w-28 h-10 border border-black rounded hover:bg-blue-600">
              Add Question
            </button>
            <button type="submit"
              class="bg-green-600 text-white text-sm font-medium my-auto w-28 h-10 border border-black rounded hover:bg-green-700">
              Save Category
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>