import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const usePreferenceStore = defineStore('preference', {
  state: () => ({
    roles: null,
    optRoles: null,
    positions: null,
    optPositions: null,
    offices: null,
    optOffices: null,
    categories: null,
    optCategories: null,
    years: null,
    optYears: null,
    messages: null,
    optMessages: null,
    sexes: null,
    optSexes: null,
    personnels: null,
    optPersonnels: null
  }),
  getters: {
    getRoles: (state) => {
      return state.roles
    },
    getOffices: (state) => {
      return state.offices
    },
    getPositions: (state) => {
      return state.positions
    },
    getCategory: (state) => {
      return state.categories
    },
    getYear: (state) => {
      return state.years
    },
    getMessage: (state) => {
      return state.messages
    },
    getSex: (state) => {
      return state.sexes
    },
    getPersonnel: (state) => {
      return state.personnels
    }
  },
  actions: {

    async fetchYear () {
      try {
        const res = await server.get('api/getYear')
        this.years = res.data
        this.optYears = res.data
        return true
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchSex () {
      try {
        const res = await server.get('api/getSex')
        this.sexes = res.data
        this.optSexes = res.data
        return true
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchRole () {
      try {
        const res = await server.get('api/getRole')
        this.roles = res.data
        this.optRoles = res.data
        return true
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchPosition () {
      try {
        const res = await server.get('api/getPosition')
        this.positions = res.data
        this.optPositions = res.data
        return true
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchOffice () {
      try {
        const res = await server.get('api/getOffice')
        this.offices = res.data
        this.optOffices = res.data
        return true
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchCategory () {
      try {
        const res = await server.get('api/getCategory')
        this.categories = res.data
        this.optCategories = res.data
        return true
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchPersonnel (id) {
      try {
        const res = await server.get(`api/getPersonnel/${id}`)
        this.personnels = res.data
        this.optPersonnels = res.data
        return true
      } catch (error) {
        if (error) throw error
      }
    },

  },
  persist: true
})
