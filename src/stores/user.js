import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    _initialized: false,
  }),
  
  getters: {
    userRole: (state) => state.user?.role?.toLowerCase(),
    isAuthenticated: (state) => !!state.user,
  },
  
  actions: {
    initialize() {
      if (this._initialized) return;
      
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          this.user = JSON.parse(userData);
          console.log("UserStore initialized from localStorage:", this.user);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        this.user = null;
      }
      
      this._initialized = true;
    },
    
    setUser(userData) {
      this.user = userData;
      this._initialized = true;
    },
    
    logout() {
      this.user = null;
      this._initialized = true;
    },
  },
});