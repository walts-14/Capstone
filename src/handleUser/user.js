import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * User store for managing user state and authentication
 */
export const useUserStore = create(
  persist(
    (set) => ({
      // Current user state
      user: [],
      // Login state
      isLoggedIn: false,
      
      // Function to set user state
      setUser: (user) => set({ user }),
      
      // Login function
      login: () => set({ isLoggedIn: true }),
      
      // Logout function
      logout: () => set({ isLoggedIn: false, user: [] }),
      
      // Check login status
      checkLoginStatus: () => {
        const state = useUserStore.getState();
        return state.isLoggedIn && state.user.length > 0;
      },

      /**
       * Creates a new user by sending data to the backend API
       * @param {Object} newUser - User data to be registered
       * @returns {Object} - Response object with success status and message
       */
      createUser: async (newUser) => {
        // Validate that all required fields are present
        if (!newUser.age || !newUser.year || !newUser.name || 
            !newUser.email || !newUser.password || !newUser.confirmPassword) {
            return { success: false, message: "All fields are required" };
        }

        try {
          // Send POST request to signup endpoint with /api prefix
          const response = await fetch("http://localhost:5000/api/signup", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(newUser),
          });

          // Parse JSON response
          const data = await response.json();
          
          // Handle API errors
          if (!response.ok) {
              return { success: false, message: data.message || "Signup failed" };
          }

          // Update user state with new user data
          set((state) => ({
              user: [...state.user, data.data],
              isLoggedIn: true
          }));
          
          // Return success response
          return { success: true, message: "User created successfully" };
        } catch (error) {
          // Handle network errors
          console.error("Signup error:", error);
          return { success: false, message: "Network error. Please try again." };
        }
      }
    }),
    {
      name: "user-store", // unique name for localStorage
    }
  )
);
