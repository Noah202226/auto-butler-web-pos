import { create } from "zustand";
import { databases, ID } from "../lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = "products";

export const useProductStore = create((set, get) => ({
  products: [],

  fetchProducts: async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID
      );
      set({ products: res.documents });
    } catch (err) {
      console.error("Fetch products failed", err);
    }
  },

  addProduct: async (newProduct) => {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        ID.unique(),
        newProduct
      );
      set((state) => ({ products: [...state.products, doc] }));
    } catch (err) {
      console.error("Add product failed", err);
    }
  },

  removeProduct: async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
      set((state) => ({
        products: state.products.filter((p) => p.$id !== id),
      }));
    } catch (err) {
      console.error("Delete product failed", err);
    }
  },
}));
