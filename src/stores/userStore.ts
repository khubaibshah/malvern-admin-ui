import { defineStore } from 'pinia';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: [] as User[],
  }),
  getters: {
    hasUser(): boolean {
      return this.user.length > 0;
    },
  },
  actions: {
    setUser(user: User[]) {
      this.user = user;
    },
    clearUser() {
      this.user = [];
    },
    getUser() {
      return this.user;
    },
  },
});
