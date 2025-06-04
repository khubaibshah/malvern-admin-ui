import { defineStore } from 'pinia';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: [] as User[],
    users: [],
  }),
  getters: {
    hasUser(): boolean {
      return this.user.length > 0;
    },
    hasUsers(): boolean {
      return this.users.length > 0;
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
    //allusers
    setUsers(users: User[]) {
      this.users = users;
    },
    clearUsers() {
      this.users = [];
    },
    getUsers() {
      return this.users;
    },
  },
});
