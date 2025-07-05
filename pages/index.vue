<script setup lang="ts">
import type { Board } from "~/models/board";
import type { Category } from "~/models/category";

const gameStore = useGameStore();
const teamStore = useTeamStore();
const importErrorMessage = ref<string>("");
const showBoardEditModal = ref<boolean>(false);
const selectedBoard = ref<Board>();

function resetBoard() {
	gameStore.resetBoardData();
	teamStore.resetPoints();
}

const deleteBoard = (index: number) => {
	gameStore.boards.splice(index, 1);
};

const editBoard = (boardIndex: number) => {
	selectedBoard.value = gameStore.boards[boardIndex];
	showBoardEditModal.value = true;
};

const startGame = async (board: Board) => {
	gameStore.setBoardData(board);
	if (gameStore.boardData) {
		await navigateTo("/board");
	} else {
		console.error("Could not load the Board data!");
	}
};

function importFile(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = () => {
		try {
			const json = JSON.parse(reader.result as string);

			if ("categories" in json) {
				// Detected as a Board
				const board = json as Board;
				board.id = `brd-${Date.now()}-${gameStore.boards.length}`;
				gameStore.boards.push(board);
			} else if ("cards" in json) {
				// Detected as a single Category
				const category = json as Category;
				category.id = `cat-${Date.now()}-${gameStore.categories.length}`;
				gameStore.categories.push(category);
			} else {
				importErrorMessage.value = "Could not read file format";
				console.warn("Invalid JSON structure");
			}
		} catch (err) {
			importErrorMessage.value = "Error trying to read file";
			console.error("Error parsing JSON:", err);
		}
	};

	reader.readAsText(file);
}

onMounted(async () => {
	const gameStore = useGameStore();

	if (gameStore.categories.length === 0 && gameStore.boards.length === 0) {
		await gameStore.fetchExampleBoard();
	}
	gameStore.setCategoriesID();
});
</script>

<template>
	<div class="mx-auto w-full">
		<!-- Start, Reset buttons -->
		<section class="text-center pb-16">
			<h1 class="text-3xl font-bold py-2">Jeopardy!</h1>
			<div class="flex flex-row justify-evenly w-[60%] mx-auto">
				<button
					type="button"
					class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-28 font-medium border-2 border-black"
					@click="resetBoard()">
					Reset
				</button>
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
					<h1 class="text-2xl font-semibold py-2">
						Select Categories or Board
					</h1>
					<p
						v-show="importErrorMessage"
						class="text-red-500 font-bold">
						{{ importErrorMessage }}
					</p>
					<div class="flex flex-col my-auto">
						<!-- <input type="file" accept=".json" class="" @change="importFile" /> -->
						<input
							type="file"
							accept=".json"
							id="jsonUpload"
							@change="importFile"
							class="hidden" />

						<!-- Styled label that looks like a button -->
						<label
							for="jsonUpload"
							class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 border border-black rounded cursor-pointer">
							Upload JSON
						</label>
					</div>
				</div>
				<!-- Categories -->
				<ClientOnly>
					<CategorySelection
						:category-list="gameStore.categories"></CategorySelection>
				</ClientOnly>
				<!-- Boards -->
				<ClientOnly>
					<h2 class="text-xl font-semibold mt-4">Boards</h2>
					<div
						v-for="(board, index) in gameStore.boards"
						class="grid grid-cols-[1fr_8fr_1fr_1fr_1fr] gap-x-2 px-2 my-2 mx-auto min-h-12 h-auto rounded bg-gray-100">
						<div
							class="cursor-pointer m-auto"
							title="Play">
							<Icon
								icon="material-symbols:play-arrow-rounded"
								width="25"
								height="25"
								@click="startGame(board)" />
						</div>
						<div class="flex gap-x-1 my-auto px-2 font-medium">
							<p class="">{{ board.name }}</p>
						</div>
						<div
							class="cursor-pointer m-auto"
							title="Download as JSON">
							<Icon
								icon="material-symbols:download-rounded"
								width="25"
								height="25"
								@click="exportItem(board)" />
						</div>
						<div
							class="cursor-pointer m-auto"
							title="Settings">
							<Icon
								icon="ion:settings-outline"
								width="25"
								height="25"
								@click="editBoard(index)" />
						</div>

						<Icon
							icon="ion:trash"
							width="25"
							height="25"
							@click="deleteBoard(index)"
							class="cursor-pointer m-auto" />
					</div>
				</ClientOnly>
			</div>
		</section>
		<Modal
			:show="showBoardEditModal"
			width="75%"
			:can-close="false"
			@close="showBoardEditModal = false">
			<EditBoard
				:board="selectedBoard"
				@close="showBoardEditModal = false"></EditBoard>
		</Modal>
	</div>
</template>
