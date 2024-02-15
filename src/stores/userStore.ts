import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore('user', {
  state: (): { user: User | null } => ({
    user: null,
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
    getUser() {
      return this.user;
    },
  },
});
