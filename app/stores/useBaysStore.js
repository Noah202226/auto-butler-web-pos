import { create } from "zustand";
import { databases, ID } from "../lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const BAYS_COLLECTION_ID = "bayname";

export const useBaysStore = create((set, get) => ({
  bays: [],

  fetchBays: async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        BAYS_COLLECTION_ID
      );
      set({ bays: res.documents });
    } catch (err) {
      console.error("Fetch bays failed", err);
    }
  },

  addBay: async (name) => {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        BAYS_COLLECTION_ID,
        ID.unique(),
        { name }
      );
      set((state) => ({ bays: [...state.bays, doc] }));
    } catch (err) {
      console.error("Add bay failed", err);
    }
  },

  removeBay: async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, BAYS_COLLECTION_ID, id);
      set((state) => ({ bays: state.bays.filter((b) => b.$id !== id) }));
    } catch (err) {
      console.error("Delete bay failed", err);
    }
  },
}));
