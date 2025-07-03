import { defineStore } from 'pinia'
import type { Board } from '~/models/board'
import type { Card } from '~/models/card'
import type { Category } from '~/models/category'

export interface ApiResponse {
  status: string
  message: string
  board: Board
}

export const useGameStore = defineStore('game', {
  state: () => ({
    boardData: undefined as Board | undefined,
    currentRound: 1 as Number,
    categories: [] as Category[],
    boards: [] as Board[],
  }),
  actions: {
    async fetchExampleBoard() {
      try {
        const response = await $fetch<ApiResponse>('/boards/exampleBoard.json')
        if (response.board) {
          const newCategories: Category[] = [];
          const newBoard: Board[] = [];

          const enhancedBoard: Board = {
            name: response.board.name,
            settings: response.board.settings,
            id: response.board.id ?? `${response.board.name}-${Date.now()}`,
            categories: response.board.categories.map((category, catIndex) => {
              const enhancedCategory: Category = {
                ...category,
                cards: category.cards.map((card, cardIndex) => ({
                  ...card,
                  id: card.id ?? `${catIndex}-${cardIndex}`,
                  available: card.available ?? true,
                }))
              };

              // Collect the enhanced category
              newCategories.push(enhancedCategory);
              return enhancedCategory;
            })
          };
          newBoard.push(enhancedBoard);
          this.boardData = enhancedBoard;
          this.categories = newCategories;
          this.boards = newBoard;
        }
      } catch (error) {
        console.error('Error loading JSON:', error)
      }

    },
    setBoardData(newBoard: Board) {
      if (!newBoard) return;
      this.currentRound = 1;
      newBoard = balanceCategoriesPerRounds(newBoard);  
      this.boardData = this.cloneBoardWithAvailableCards(newBoard);
    },
    resetBoardData() {
      this.boardData = undefined;
    },
    cloneBoardWithAvailableCards(board: Board): Board {
      return {
        ...board,
        categories: board.categories
          .map(category => {
            const validCards = category.cards
              .filter(card => card.question.trim() !== '')
              .map(card => ({ ...card, available: true }));

            return {
              ...category,
              cards: validCards
            };
          })
          .filter(category => category.cards.length > 0) // remove empty categories
      };
    },
    setCategoriesID() {
      this.categories.forEach((category, index) => {
        if (!category.id) {
          category.id = `cat-${Date.now()}-${index}`
        }
      })
    }
  },
  persist: true,
})
