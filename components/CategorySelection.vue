<script lang="ts" setup>
import type { Board } from "~/models/board";
import type { Category } from "~/models/category";

const props = defineProps<{
	categoryList: Category[];
}>();

const gameStore = useGameStore();
const showEditCategory = ref<Category>();
const addCategoryToBoardObj = ref<Category>();
const selectedBoard = ref<Board>();

const newBoard = reactive({
	categories: [] as Category[],
});

const selectedCategoryIds = computed({
	get() {
		return newBoard.categories.map((cat) => cat.id);
	},
	set(newIds: string[]) {
		newBoard.categories = props.categoryList.filter((cat) =>
			newIds.includes(cat.id)
		);
	},
});

const isSelected = (id: string) => {
	return newBoard.categories.some((c) => c.id === id);
};

const editCategory = (index: number) => {
	if (gameStore.categories[index] === showEditCategory.value) {
		showEditCategory.value = undefined;
	} else {
		showEditCategory.value = gameStore.categories[index];
	}
};

const deleteCategory = (index: number) => {
	gameStore.categories.splice(index, 1);
};

const updateCategory = (updatedCategory: Category) => {
	let index = gameStore.categories.findIndex(
		(category) => category.id === updatedCategory.id
	);
	updatedCategory.id = `cat-${Date.now()}-${index}`;
	gameStore.categories.splice(index, 1, updatedCategory);
};

const createBoard = () => {
	if (!Array.isArray(newBoard.categories) || !newBoard.categories.length) {
		console.error("Could not create Board, Categories is empty!");
		return;
	}
	let createdBoard: Board = {
		id: `brd-${Date.now()}`,
		name: newBoard.categories[0].name,
		categories: newBoard.categories,
		settings: {
			dailyDouble: false,
			finalJep: {
				enable: false,
			},
			round1Cat: [],
			round2Cat: [],
		},
	};
	gameStore.boards.push(createdBoard);
	resetNewBoard();
};

const toggleAddCategoryToBoard = (category?: Category) => {
	if (category) {
		addCategoryToBoardObj.value = category;
		return;
	}
	addCategoryToBoardObj.value = undefined;
};

const addCategoryToBoard = (
	category: Category,
	boardID: string | undefined
) => {
	if (!boardID) {
		return;
	}
	let index = gameStore.boards.findIndex(
		(board: Board) => board.id.toString() === boardID.toString()
	);
	if (!boardID || index < 0) {
		toggleAddCategoryToBoard();
		return;
	}
	if (
		!gameStore.boards[index].categories.some((cat) => cat.id === category.id)
	) {
		if (gameStore.boards[index].categories.length < 10) {
			gameStore.boards[index].categories.push(category);
		}
	}
	toggleAddCategoryToBoard();
};

function resetNewBoard() {
	newBoard.categories = [];
}

function toggleCategory(category: Category) {
	const index = newBoard.categories.findIndex((c) => c.id === category.id);
	if (index > -1) {
		newBoard.categories.splice(index, 1);
	} else if (newBoard.categories.length < 10) {
		// Add with default round
		newBoard.categories.push(category);
	}
}
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold">Categories</h2>

		<div
			v-for="(category, index) in categoryList"
			class="grid grid-cols-[6fr_1fr_1fr_1fr_1fr] gap-x-2 p-2 my-2 mx-auto h-auto rounded bg-gray-100">
			<div class="flex gap-x-1 my-auto px-2 font-medium">
				<input
					type="checkbox"
					:id="category.id"
					class="accent-green-600"
					:disabled="
						!isSelected(category.id) && newBoard.categories.length >= 10
					"
					v-model="selectedCategoryIds"
					:value="category.id" />
				<label :for="category.id">{{ category.name }}</label>
			</div>

			<div
				class="cursor-pointer m-auto"
				title="Edit Category">
				<Icon
					icon="material-symbols:edit-square-outline"
					width="20"
					height="20"
					@click="editCategory(index)" />
			</div>
			<div
				class="cursor-pointer m-auto"
				title="Add to Board">
				<Icon
					icon="material-symbols:add-2-rounded"
					width="20"
					height="20"
					@click="toggleAddCategoryToBoard(category)" />
			</div>
			<div
				class="cursor-pointer m-auto"
				title="Download as JSON">
				<Icon
					icon="material-symbols:download-rounded"
					width="20"
					height="20"
					@click="exportItem(category)" />
			</div>

			<div
				class="cursor-pointer m-auto"
				title="Delete Category">
				<Icon
					icon="ion:trash"
					width="20"
					height="20"
					@click="deleteCategory(index)" />
			</div>

			<!-- modals -->
			<Modal
				:show="showEditCategory === category"
				width="75%"
				:can-close="false"
				@close="showEditCategory = undefined"
				class="">
				<EditCategory
					:category="category"
					@close="showEditCategory = undefined"
					@update="updateCategory">
				</EditCategory>
			</Modal>
			<Modal
				:show="addCategoryToBoardObj === category"
				width="50%"
				:can-close="true"
				@close="toggleAddCategoryToBoard()"
				class="">
				<div class="flex flex-col gap-y-2">
					<div>
						<h3 class="font-medium text-lg">Select Board</h3>
						<p class="text-sm text-gray-500">
							Choose a Board to add the Category to. The Board cannot be full
							(have 10 Categories).
						</p>
					</div>
					<select
						v-model="selectedBoard"
						class="w-52 h-8 cursor-pointer border-2 border-black rounded">
						<option
							v-for="board in gameStore.boards"
							:value="board"
							:disabled="board.categories.length >= 10">
							{{
								board.categories.length < 10
									? board.name
									: `Full - ${board.name}`
							}}
						</option>
					</select>
					<button
						@click="addCategoryToBoard(category, selectedBoard?.id)"
						:disabled="(selectedBoard?.categories?.length ?? 0) >= 10"
						class="bg-green-600 text-white w-28 py-2 border border-black rounded hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-500">
						Add Category
					</button>
				</div>
			</Modal>
		</div>
		<button
			type="submit"
			@click="createBoard()"
			class="bg-green-600 text-white w-28 py-2 border border-black rounded hover:bg-green-700">
			Create Board
		</button>
	</div>
</template>
