import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    isAuthenticated: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    setUser(user: any) {
      this.user = user
      this.isAuthenticated = !!user
    },

    clearUser() {
      this.user = null
      this.isAuthenticated = false
    },
  },
})
