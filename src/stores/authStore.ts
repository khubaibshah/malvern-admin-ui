import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    isAuthenticated: false,
    token: '',
  }),
  actions: {
    setAuthenticated(status: boolean) {
      this.isAuthenticated = status
    },
    setToken(token: string) {
      this.token = token
      console.log('token from login',this.token)
    },
    getToken() {
      return this.token;
    },
    clearToken() {
      this.token = '';
    },
  }
})
