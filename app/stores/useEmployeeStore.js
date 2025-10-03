"use client";

import { create } from "zustand";
import { databases } from "../lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = "68dd10f9001a68982ac8"; // your DB ID
const EMPLOYEES_COLLECTION_ID = "employees"; // 👈 your collection name

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  // Fetch all employees
  fetchEmployees: async () => {
    try {
      set({ loading: true, error: null });
      const res = await databases.listDocuments(
        DATABASE_ID,
        EMPLOYEES_COLLECTION_ID,
        [Query.orderAsc("name")]
      );
      set({ employees: res.documents });
    } catch (error) {
      console.error("❌ Error fetching employees:", error);
      set({ error: "Failed to load employees" });
    } finally {
      set({ loading: false });
    }
  },
}));
