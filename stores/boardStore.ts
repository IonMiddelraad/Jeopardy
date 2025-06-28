import { defineStore } from 'pinia'
import type { Board } from '~/models/board'
import type { Card } from '~/models/card'
import type { Category } from '~/models/category'

export interface ApiResponse {
  status: string
  message: string
  board: Board
}

export const useMyBoardStore = defineStore('board', {
  state: () => ({
    boardData: null as Board | null,
    categories: [] as Category[],
  }),
  actions: {
    async fetchBoard() {
      try {
        const response = await $fetch<ApiResponse>('/boards/testBoard.json')
        if (response.board) {
          const newCategories: Category[] = [];

          const enhancedBoard: Board = {
            categories: response.board.categories.map((category, catIndex) => {
              const enhancedCategory: Category = {
                ...category,
                cards: category.cards.map((card, cardIndex) => ({
                  ...card,
                  id: `${catIndex}-${cardIndex}`,
                  available: card.available ?? true,
                }))
              };

              // Collect the enhanced category
              newCategories.push(enhancedCategory);
              return enhancedCategory;
            })
          };
          this.boardData = enhancedBoard;
          this.categories = newCategories;
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
        console.log(tempCat)
        for (let card of category.questions) {
          let tempCard: Card = card;
          tempCard.available = true;
        }
      }
      console.log(tempBoard.categories[0].cards[4].question)
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
