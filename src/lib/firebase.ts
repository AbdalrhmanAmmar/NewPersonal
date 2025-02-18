import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2o5uXoJiil19yI0e8hZ-VORz1oHFjNk0",
  authDomain: "personal-tracker-895e8.firebaseapp.com",
  projectId: "personal-tracker-895e8",
  storageBucket: "personal-tracker-895e8.firebasestorage.app",
  messagingSenderId: "345542040303",
  appId: "1:345542040303:web:ad26b7534a2f092d2f191a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection names as constants to avoid typos
export const COLLECTIONS = {
  USERS: "users",
  EXPENSES: "expenses",
  GOALS: "goals",
  GOAL_CONTRIBUTIONS: "goal_contributions",
  RECURRING_EXPENSES: "recurring_expenses",
  BUDGETS: "budgets",
} as const;


// Firestore data types
export interface User {
  id: string;
  fullName: string;
  avatarUrl?: string;
  currency: string;
  dateFormat: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string; // Now a string instead of categoryId
  date: Date;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
}

export interface RecurringExpense {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  amount: number;
  frequency: string;
  dueDay: number;
  lastCharged?: Date;
  nextCharge: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: Date;
  createdAt: Date;
  updatedAt: Date;
}
