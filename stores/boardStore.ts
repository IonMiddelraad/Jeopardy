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
    boardData: null as Board | null,
    categories: [] as Category[],
    boards: [] as Board[],
  }),
  actions: {
    async fetchBoard() {
      try {
        const response = await $fetch<ApiResponse>('/boards/testBoard.json')
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
    setBoardData(newBoard: any) {
      if (!newBoard) return;
      let tempBoard: Board = newBoard.board;
      for (let category of newBoard.board.categories) {
        let tempCat: Category = category;
        for (let card of category.questions) {
          let tempCard: Card = card;
          tempCard.available = true;
        }
      }
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
