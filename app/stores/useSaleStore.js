import { create } from "zustand";
import { databases } from "../lib/appwrite"; // adjust path if needed

const DB_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const SALES_COLLECTION_ID = "transactions";
const EXPENSES_COLLECTION_ID = "expenses";

const useSalesStore = create((set) => ({
  sales: [],
  expenses: [],
  loading: false,

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

  fetchExpenses: async () => {
    set({ loading: true });
    try {
      const res = await databases.listDocuments(DB_ID, EXPENSES_COLLECTION_ID);
      set({ expenses: res.documents });
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      set({ loading: false });
    }
  },

  //   addSale: async (data) => {
  //     try {
  //       await databases.createDocument(
  //         DB_ID,
  //         SALES_COLLECTION_ID,
  //         "unique()",
  //         data
  //       );
  //       set((state) => ({ sales: [...state.sales, data] }));
  //     } catch (error) {
  //       console.error("Error adding sale:", error);
  //     }
  //   },

  addExpense: async (data) => {
    try {
      await databases.createDocument(
        DB_ID,
        EXPENSES_COLLECTION_ID,
        "unique()",
        data
      );
      set((state) => ({ expenses: [...state.expenses, data] }));
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  },
}));

export default useSalesStore;
