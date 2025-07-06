<script setup lang="ts">
import type { Board } from "~/models/board";
import type { Category } from "~/models/category";

const gameStore = useGameStore();
const teamStore = useTeamStore();
const importErrorMessage = ref<string>("");
const showBoardEditModal = ref<boolean>(false);
const selectedBoard = ref<Board>();

const deleteBoard = (index: number) => {
	gameStore.boards.splice(index, 1);
};

const editBoard = (boardIndex: number) => {
	selectedBoard.value = gameStore.boards[boardIndex];
	showBoardEditModal.value = true;
};

const startGame = async (board: Board) => {
	teamStore.resetPoints();
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
	<div class="flex flex-col gap-y-5 mx-auto w-full">
		<!-- Start, Reset buttons -->
		<section class="text-center pb-8">
			<h1 class="text-3xl font-bold py-2">Jeopardy!</h1>
			<div class="flex flex-col gap-y-2 w-[60%] mx-auto">
				<ClientOnly>
					<NuxtLink
						v-if="gameStore.boardData"
						class="bg-green-500 hover:bg-green-600 text-white font-semibold w-36 py-2 border-2 border-black rounded mx-auto"
						to="/board">
						Resume Game
					</NuxtLink>
				</ClientOnly>

				<div class="py-2 px-4 mx-auto">
					<input
						type="file"
						accept=".json"
						id="jsonUpload"
						@change="importFile"
						class="hidden" />

					<!-- Styled label that looks like a button -->
					<label
						for="jsonUpload"
						class="bg-blue-500 hover:bg-blue-600 text-white font-semibold w-36 px-4 py-2 border-2 border-black rounded cursor-pointer">
						Upload JSON
					</label>
					<p
						v-show="importErrorMessage"
						class="text-red-500 font-bold">
						{{ importErrorMessage }}
					</p>
				</div>
			</div>
		</section>
		<!-- explanation -->
		<section
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-10 mx-auto gap-x-8">
			<div>
				<h2 class="text-lg font-semibold">Play a custom game of jeopardy!</h2>
				<p>
					Hit "play" on one of the boards to start playing! You can also edit
					any board by clicking on the settings button.<br />
					Want to save a board for later or on another device? Click the
					download button on a board to download it to your device. Click the
					"Upload JSON" button to load in the downloaded board later.
				</p>
			</div>
			<div>
				<h2 class="text-lg font-semibold">
					Turn your categories into a board!
				</h2>
				<p>
					Select multiple categories and click the "Create Board" button to make
					a board with the selected categories. You can also edit existing
					categories in this list or add them to an already existing board.
				</p>
			</div>
			<div>
				<h2 class="text-lg font-semibold">Make your own categories!</h2>
				<p>
					Create your own categories to add them to a board. You can customize
					the amount of points the question gives as well!
				</p>
			</div>
		</section>

		<!-- Grid -->
		<section
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-10 mx-auto gap-x-10">
			<!-- Boards -->
			<div>
				<h1 class="text-2xl font-semibold py-2">Select Board to play</h1>
				<ClientOnly>
					<h2 class="text-xl font-semibold">Boards</h2>
					<div
						v-for="(board, index) in gameStore.boards"
						class="grid grid-cols-[1fr_8fr_1fr_1fr_1fr] gap-x-2 px-2 my-2 mx-auto min-h-12 h-auto rounded bg-gray-200">
						<div
							class="cursor-pointer m-auto"
							title="Play">
							<Icon
								icon="material-symbols:play-arrow-rounded"
								width="25"
								height="25"
								@click="startGame(board)" />
						</div>
						<div class="flex gap-x-1 my-auto px-2 font-medium overflow-hidden">
							<p class="truncate block max-w-full">{{ board.name }}</p>
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
			<!-- select category or board -->
			<div class="">
				<div class="flex justify-between">
					<h1 class="text-2xl font-semibold py-2">Select Categories</h1>
				</div>
				<!-- Categories -->
				<ClientOnly>
					<CategorySelection
						:category-list="gameStore.categories"></CategorySelection>
				</ClientOnly>
			</div>
			<!-- create category -->
			<div class="row-span-5">
				<h1 class="text-2xl font-semibold py-2">Create a Category</h1>
				<CreateCategory></CreateCategory>
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
