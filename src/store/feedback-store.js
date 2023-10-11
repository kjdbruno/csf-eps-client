import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    id: null,
    name: null,
    office: null,
    position: null,
    description: null,
    photo: null,
    phyRating: null,
    serRating: null,
    perRating: null,
    ovrRating: null,
    list: null
  }),
  getters: {
    getId: (state) => {
      return state.id
    },
    getName: (state) => {
      return state.name
    },
    getOffice: (state) => {
      return state.office
    },
    getPosition: (state) => {
      return state.position
    },
    getDescription: (state) => {
      return state.description
    },
    getPhoto: (state) => {
      return state.photo
    },
    getPhyRating: (state) => {
      return state.phyRating
    },
    getSerRating: (state) => {
      return state.serRating
    },
    getPerRating: (state) => {
      return state.perRating
    },
    getOvrRating: (state) => {
      return state.ovrRating
    },
    getList: (state) => {
      return state.list
    }
  },
  actions: {
    
    async fetchFeedbackKioskDetail (id) {
      try {
        return await server.get(`api/kiosk/detail/${id}`)
      } catch (error) {
        if (error) throw error
      }
    },

    setKiosk (payload) {
      this.name = payload.name
      this.office = payload.office
      this.position = payload.position
      this.description = payload.description
      this.photo = payload.photo
      this.list = payload.list
    },

    setPhyRating (payload) {
      this.phyRating = payload
    },

    setSerRating (payload) {
      this.serRating = payload
    },

    setPerRating (payload) {  
      this.perRating = payload
    },

    setOvrRating (payload) {  
      this.ovrRating = payload
    },

    setList (payload) {
      this.list = payload
    },

    clearKiosk () {
      this.name = ''
      this.office = ''
      this.position = ''
      this.description = ''
      this.photo = ''
      this.phyRating = ''
      this.serRating = ''
      this.perRating = ''
      this.ovrRating = ''
      this.list = ''
    }

  },
  persist: true
})
