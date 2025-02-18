import { create } from "zustand";
import {auth} from "../lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface AuthState {
  user: any;
  error: string | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  error: null,
  loading: false,

  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with full name
      await updateProfile(user, { displayName: fullName });

      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        fullName: fullName,
        email: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
