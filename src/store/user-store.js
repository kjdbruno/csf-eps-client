import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    id: null,
    name: null,
    email: null,
    roleID: null,
    sexID: null,
    number: null,
    isVerified: null,
    avatar: null,
    isCitizen: null,
    discussionID: null,
  }),
  getters: {
    getToken: (state) => {
      return state.token
    },
    getId: (state) => {
      return state.id
    },
    getName: (state) => {
      return state.name
    },
    getEmail: (state) => {
      return state.email
    },
    getRoleID: (state) => {
      return state.roleID
    },
    getSexID: (state) => {
      return state.sexID
    },
    getNumber: (state) => {
      return state.number
    },
    getIsVerified: (state) => {
      return state.isVerified
    },
    getAvatar: (state) => {
      return state.avatar
    },
    getIsCitizen: (state) => {
      return state.isCitizen
    },
    getDiscussionID: (state) => {
      return state.discussionID
    }
  },
  actions: {
    async getSanctumCookie () {
      try {
        await server.get('sanctum/csrf-cookie')
      } catch (error) {
        if (error) throw error
      }
    },

    async login (email, password) {
      try {
        return await server.post('login', { email, password })
      } catch (error) {
        if (error) throw error
      }
    },

    async register (name, email, password, confirmPassword) {
      try {
        return await server.post('/register', {
          name,
          email,
          password,
          password_confirmation: confirmPassword
        })
      } catch (error) {
        if (error) throw error
      }
    },

    async logout () {
      try {
        await server.post('/logout')
        this.clearUser()
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchUser () {
      try {
        return await server.get('api/auth/user')
      } catch (error) {
        if (error) throw error
      }
    },

    setUser (payload) {
      this.id = payload.id
      this.name = payload.name
      this.email = payload.email
      this.roleID = payload.roleID
      this.sexID = payload.sexID
      this.number = payload.number
      this.isVerified = payload.isVerified
      this.avatar = payload.avatar
      if (payload.roleID == 5) {
        this.isCitizen = true
      }
    },

    clearUser () {
      this.token = null
      this.id = null
      this.name = null
      this.email = null
      this.roleID = null
      this.sexID = null
      this.number = null
      this.isVerified = null
      this.avatar = null
      this.isCitizen = null
      this.discussionID = null
    }
  },
  persist: true
})
