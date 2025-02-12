import { create } from "zustand";

export const useUserStore = create((set) => ({
    user: [],
    setUser: (user) => set({ user }),
    createUser: async (newUser) => {

        //check if all fields are filled
        if (!newUser.age || !newUser.year || !newUser.name || !newUser.email || !newUser.password || !newUser.confirmPassword) {
            return (success = false, message = "All fields are required");
        }

        const response = await fetch("http://localhost:5173/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        });

        const data = await response.json();
        set((state) => ({
            user: [...state.user, data.data],
        }));
        return { success: true, message: "User created successfully" };
    } 
    }));