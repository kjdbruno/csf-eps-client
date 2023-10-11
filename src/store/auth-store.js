import { defineStore } from 'pinia'
import { server } from '../boot/axios'
import state from './user-store/state'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    id: null,
    name: null,
    email: null,
    avatar: null,
    office: null,
    position: null,
    year: null,
    role: null,
    officeID: null,
    positionID: null,
    yearID: null,
    employeeID: null,
    roleID: null,
    isActive: null,
    isAdmin: null,
    isSup: null,
    isMgmt: null,
    isEncoder: null,
    feedbackID: null,
    discussionID: null,
    isVerified: false,
    notAuthenticated: false
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
    getAvatar: (state) => {
      return state.avatar
    },
    getOffice: (state) => {
      return state.office
    },
    getPosition: (state) => {
      return state.position
    },
    getYear: (state) => {
      return state.year
    },
    getRole: (state) => {
      return state.role
    },
    getOfficeID: (state) => {
      return state.officeID
    },
    getPositionID: (state) => {
      return state.positionID
    },
    getYearID: (state) => {
      return state.yearID
    },
    getEmployeeID: (state) => {
      return state.employeeID
    },
    getRoleID: (state) => {
      return state.roleID
    },
    getIsActive: (state) => {
      return state.isActive
    },
    getAdmin: (state) => {
      return state.isAdmin
    },
    getSupervisor: (state) => {
      return state.isSup
    },
    getMgmt: (state) => {
      return state.isMgmt
    },
    getEncoder: (state) => {
      return state.isEncoder
    },
    getFeedbackID: (state) => {
      return state.feedbackID
    },
    getDiscussionID: (state) => {
      return state.discussionID
    },
    getIsVerified: (state) => {
      return state.isVerified
    },
    getNotAuthenticated: (state) => {
      return state.notAuthenticated
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
      this.avatar = payload.avatar
      this.office = payload.office
      this.position = payload.position
      this.year = payload.year
      this.role = payload.role
      this.officeID = payload.officeID
      this.positionID = payload.positionID
      this.yearID = payload.yearID
      this.employeeID = payload.employeeID
      this.roleID = payload.roleID
      this.isActive = payload.isActive
      if (payload.roleID == 1) {
        this.isAdmin = true
        this.isSup = false
        this.isMgmt = false
        this.isEncoder = false
      } else if (payload.roleID == 2) {
        this.isAdmin = false
        this.isSup = true
        this.isMgmt = false
        this.isEncoder = false
      } else if (payload.roleID == 3) {
        this.isAdmin = false
        this.isSup = false
        this.isMgmt = true
        this.isEncoder = false
      } else if (payload.roleID == 4) {
        this.isAdmin = false
        this.isSup = false
        this.isMgmt = false
        this.isEncoder = true
      }
      this.isVerified = (payload.vCount <= 0 ? true : false)
    },

    clearUser () {
      this.token = null
      this.id = null
      this.name = null
      this.email = null
      this.avatar = null
      this.office = null
      this.position = null
      this.year = null
      this.role = null
      this.officeID = null
      this.positionID = null
      this.yearID = null
      this.employeeID = null
      this.isActive = null
      this.isAdmin = false
      this.isSup = false
      this.isMgmt = false
      this.isEncoder = false
      this.feedbackID = null
      this.discussionID = null
      this.isVerified = false
      this.notAuthenticated = false
    }
  },
  persist: true
})
