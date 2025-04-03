import { defineStore } from 'pinia'

export const useMyBoardStore = defineStore( 'board', {
  state: () => ({ 
    data: null,
   }),
  actions: {
    async fetchData() {
      try {
        const response = await fetch('/boards/testBoard.json')  // Ensure the JSON is in `public/data.json`
        this.data = await response.json()
      } catch (error) {
        console.error('Error loading JSON:', error)
      }
    }
  }
})
