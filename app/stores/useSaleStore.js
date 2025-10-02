import { create } from "zustand";
import { persist } from "zustand/middleware";
import { databases } from "../lib/appwrite";

const DB_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const SALES_COLLECTION_ID = "transactions";
const EXPENSES_COLLECTION_ID = "expenses";

const useSalesStore = create(
  persist(
    (set, get) => ({
      sales: [],
      expenses: [],
      loading: false,

      // --- SALES ---
      fetchSales: async () => {
        set({ loading: true });
        try {
          const res = await databases.listDocuments(DB_ID, SALES_COLLECTION_ID);
          set({ sales: res.documents });
        } catch (error) {
          console.error("Error fetching sales:", error);
        } finally {
          set({ loading: false });
        }
      },

      addSale: async (data) => {
        try {
          const res = await databases.createDocument(
            DB_ID,
            SALES_COLLECTION_ID,
            "unique()",
            data
          );
          set((state) => ({ sales: [...state.sales, res] }));
          return res;
        } catch (error) {
          console.error("Error adding sale:", error);
        }
      },

      deleteSale: async (id) => {
        try {
          await databases.deleteDocument(DB_ID, SALES_COLLECTION_ID, id);
          set((state) => ({
            sales: state.sales.filter((s) => s.$id !== id),
          }));
        } catch (error) {
          console.error("Error deleting sale:", error);
        }
      },

      // --- EXPENSES ---
      fetchExpenses: async () => {
        set({ loading: true });
        try {
          const res = await databases.listDocuments(
            DB_ID,
            EXPENSES_COLLECTION_ID
          );
          set({ expenses: res.documents });
        } catch (error) {
          console.error("Error fetching expenses:", error);
        } finally {
          set({ loading: false });
        }
      },

      addExpense: async (data) => {
        try {
          const res = await databases.createDocument(
            DB_ID,
            EXPENSES_COLLECTION_ID,
            "unique()",
            data
          );
          set((state) => ({ expenses: [...state.expenses, res] }));
          return res;
        } catch (error) {
          console.error("Error adding expense:", error);
        }
      },

      deleteExpense: async (id) => {
        try {
          await databases.deleteDocument(DB_ID, EXPENSES_COLLECTION_ID, id);
          set((state) => ({
            expenses: state.expenses.filter((e) => e.$id !== id),
          }));
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      },
    }),
    {
      name: "sales-expenses-storage", // key in localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useSalesStore;
