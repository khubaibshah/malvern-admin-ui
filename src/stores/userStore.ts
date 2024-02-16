import { defineStore } from 'pinia';

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

export const useUserStore = defineStore('user', {
  state: () => ({
    user: [],
  }),
  getters: {
    hasUser: (state) => state.user.length > 0,
  },
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
