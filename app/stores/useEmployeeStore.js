"use client";

import { create } from "zustand";
import { databases, ID } from "../lib/appwrite";
import { Query } from "appwrite";
import toast from "react-hot-toast";

const DATABASE_ID = "68dd10f9001a68982ac8";
const EMPLOYEES_COLLECTION_ID = "employees";

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

  // Add employee
  addEmployee: async (newEmployee) => {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        EMPLOYEES_COLLECTION_ID,
        ID.unique(),
        newEmployee
      );
      set((state) => ({
        employees: [...state.employees, doc],
      }));
      toast.success("New employee added.");
    } catch (error) {
      console.error("❌ Error adding employee:", error);
      set({ error: "Failed to add employee" });
    }
  },

  // Delete employee
  removeEmployee: async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, EMPLOYEES_COLLECTION_ID, id);
      set((state) => ({
        employees: state.employees.filter((emp) => emp.$id !== id),
      }));
    } catch (error) {
      console.error("❌ Error deleting employee:", error);
      set({ error: "Failed to delete employee" });
    }
  },
}));
