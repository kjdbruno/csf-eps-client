import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    id: null,
  }),
  getters: {
    getId: (state) => {
      return state.id
    },
  },
  actions: {
    
  },
  persist: true
})
