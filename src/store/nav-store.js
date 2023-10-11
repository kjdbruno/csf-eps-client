import { defineStore } from 'pinia'

export const useNavStore = defineStore('nav', {
  state: () => ({
    feedbackID: null,
    discussionID: null,
    currentPage: null,
  }),
  getters: {
    getPage: (state) => {
      return state.currentPage
    },
    getFeedback: (state) => {
      return state.feedbackID
    },
    getDiscussion: (state) => {
      return state.discussionID
    },
    getPoll: (state) => {
      return state.pollId
    }
  },
  actions: {

    clearNav () {
      this.feedbackID = null
      this.discussionID = null
      this.currentPage = null
    }

  },
  persist: true
})
