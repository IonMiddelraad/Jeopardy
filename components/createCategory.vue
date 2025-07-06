<script lang="ts" setup>
import { reactive } from "vue";

const gameStore = useGameStore();
const showJson = ref(false);

const newCategory = reactive({
	id: "",
	name: "",
	cards: [{ question: "", answer: "", points: 100 }],
});

const addQuestion = () => {
	const nextPoints = (newCategory.cards.length + 1) * 100;
	newCategory.cards.push({
		question: "",
		answer: "",
		points: nextPoints,
	});
};

const removeQuestion = (index: number) => {
	newCategory.cards.splice(index, 1);
};

const resetCategory = () => {
	newCategory.name = "";
	newCategory.cards = [{ question: "", answer: "", points: 100 }];
};

const submitCategory = () => {
	newCategory.id = `cat-${Date.now()}-${newCategory.name}`;
	gameStore.categories.push(JSON.parse(JSON.stringify(newCategory)));
	// Reset form
	resetCategory();
};

const toggleJson = () => {
	showJson.value = !showJson.value;
};
</script>

<template>
	<div>
		<form
			@submit.prevent="submitCategory"
			class="space-y-4">
			<div>
				<label class="block font-medium mb-1">Category Name</label>
				<input
					v-model="newCategory.name"
					type="text"
					class="w-full border rounded p-2" />
			</div>

			<div
				v-for="(card, index) in newCategory.cards"
				:key="index"
				class="border p-3 rounded bg-gray-50">
				<h3 class="font-semibold mb-2">Question {{ index + 1 }}</h3>
				<input
					v-model="card.question"
					placeholder="Question"
					class="w-full mb-2 p-2 border rounded" />
				<input
					v-model="card.answer"
					placeholder="Answer"
					class="w-full mb-2 p-2 border rounded" />
				<input
					v-model.number="card.points"
					type="number"
					placeholder="Points"
					class="w-full mb-2 p-2 border rounded" />

				<button
					type="button"
					@click="removeQuestion(index)"
					class="text-red-500 text-sm underline">
					Remove
				</button>
			</div>
			<div class="flex gap-x-2">
				<button
					v-if="newCategory.cards.length < 5"
					type="button"
					@click="addQuestion"
					class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 border border-black">
					Add Question
				</button>

				<button
					type="submit"
					class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 border border-black">
					Save Category
				</button>
			</div>
		</form>
		<!-- Optional preview -->
		<div class="py-10">
			<button
				type="button"
				@click="toggleJson"
				class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 border border-black">
				Show .JSON
			</button>
			<pre
				v-show="showJson"
				class="my-2 bg-gray-100 p-4 rounded text-sm"
				>{{ newCategory }}</pre
			>
		</div>
	</div>
</template>
