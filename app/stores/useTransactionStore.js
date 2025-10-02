import { create } from "zustand";
import { databases } from "../lib/appwrite"; // adjust your path
import { Query } from "appwrite";

const DB_ID = "68dd10f9001a68982ac8"; // your database ID
const TRANSACTIONS_COLLECTION_ID = "transactions"; // your collection ID

const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,
  totalSales: 0,

  fetchTransactions: async () => {
    set({ loading: true });
    try {
      // Fetch all finished transactions (sales)
      const res = await databases.listDocuments(
        DB_ID,
        TRANSACTIONS_COLLECTION_ID,
        [
          Query.equal("status", "finished"), // only completed sales
        ]
      );

      const transactions = res.documents;

      // Compute total sales (amountReceived or servicePrice)
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
}));

export default useTransactionStore;
