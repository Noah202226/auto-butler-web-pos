import { create } from "zustand";
import { persist } from "zustand/middleware";
import { databases } from "../lib/appwrite";
import { Query, ID } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const TRANSACTIONS_COLLECTION_ID = "transactions";

const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      loading: false,
      totalSales: 0,

      // --- FETCH ---
      fetchTransactions: async () => {
        set({ loading: true });
        try {
          const res = await databases.listDocuments(
            DB_ID,
            TRANSACTIONS_COLLECTION_ID,
            [Query.equal("status", "finished")] // only finished sales
          );

          const transactions = res.documents;

          const totalSales = transactions.reduce(
            (acc, t) => acc + (t.amountReceived || t.servicePrice || 0),
            0
          );

          set({ transactions, totalSales });
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          set({ loading: false });
        }
      },

      // --- ADD ---
      addTransaction: async (data) => {
        try {
          const res = await databases.createDocument(
            DB_ID,
            TRANSACTIONS_COLLECTION_ID,
            ID.unique(),
            data
          );
          set((state) => {
            const updated = [...state.transactions, res];
            const totalSales = updated.reduce(
              (acc, t) => acc + (t.amountReceived || t.servicePrice || 0),
              0
            );
            return { transactions: updated, totalSales };
          });
          return res;
        } catch (error) {
          console.error("Error adding transaction:", error);
        }
      },

      // --- DELETE ---
      deleteTransaction: async (id) => {
        try {
          await databases.deleteDocument(DB_ID, TRANSACTIONS_COLLECTION_ID, id);
          set((state) => {
            const updated = state.transactions.filter((t) => t.$id !== id);
            const totalSales = updated.reduce(
              (acc, t) => acc + (t.amountReceived || t.servicePrice || 0),
              0
            );
            return { transactions: updated, totalSales };
          });
        } catch (error) {
          console.error("Error deleting transaction:", error);
        }
      },
    }),
    {
      name: "transactions-storage", // localStorage key
      getStorage: () => localStorage,
    }
  )
);

export default useTransactionStore;
