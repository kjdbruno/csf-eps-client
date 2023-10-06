import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const useNavStore = defineStore('nav', {
  state: () => ({
    currentPage: null,
  }),
  getters: {
    getPage: (state) => {
      return state.currentPage
    },
  },
  actions: {

    clearNav () {
      this.currentPage = null
    }

  },
  persist: true
})
