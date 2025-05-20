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
    data: null,
    boardData: null as Board | null,
  }),
  actions: {
    async fetchBoard() {
      try {
        const response = await $fetch<ApiResponse>('/boards/testBoard.json')
        if (response.board) {
          const enhancedBoard: Board = {
            categories: response.board.categories.map((category, catIndex) => ({
              ...category,
              cards: category.cards.map((card, cardIndex) => ({
                ...card,
                id: `${catIndex}-${cardIndex}`,         // Unique string ID
                available: card.available ?? true,      // Default to true if undefined
              }))
            }))
          }
          this.boardData = enhancedBoard;
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
    }
  },
  persist: true,
})
