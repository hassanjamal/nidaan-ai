import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    roles: [],
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setRoles(roles) {
      this.roles = roles;
    },
  },
});
