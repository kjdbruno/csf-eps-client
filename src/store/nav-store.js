import { defineStore } from 'pinia'

export const useNavStore = defineStore('nav', {
  state: () => ({
    feedbackId: null,
    discussionId: null,
    pollId: null,
    currentPage: null,
  }),
  getters: {
    getPage: (state) => {
      return state.currentPage
    },
    getFeedback: (state) => {
      return state.feedbackId
    },
    getDiscussion: (state) => {
      return state.discussionId
    },
    getPoll: (state) => {
      return state.pollId
    }
  },
  actions: {

    clearNav () {
      this.currentPage = null
    }

  },
  persist: true
})
