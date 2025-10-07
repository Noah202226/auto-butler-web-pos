import { create } from "zustand";
import { databases, ID } from "../lib/appwrite";
import toast from "react-hot-toast";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = "products";

export const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,

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

  useProduct: async (productId, quantityUsed) => {
    const { products } = get();
    const product = products.find((p) => p.$id === productId);
    if (!product) return toast.error("Product not found.");

    if (quantityUsed <= 0)
      return toast.error("Quantity must be greater than 0.");
    if (quantityUsed > product.stockQuantity)
      return toast.error("Not enough stock.");

    const newQuantity = product.stockQuantity - quantityUsed;

    try {
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId,
        { stockQuantity: newQuantity }
      );
      set({
        products: products.map((p) =>
          p.$id === productId ? { ...p, stockQuantity: newQuantity } : p
        ),
      });
      toast.success(`Used ${quantityUsed} ${product.productName}.`);
    } catch (err) {
      console.error("Use product failed", err);
      toast.error("Failed to update stock.");
    }
  },

  removeProduct: async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
      set((state) => ({
        products: state.products.filter((p) => p.$id !== id),
      }));
      toast.success("Product deleted.");
    } catch (err) {
      console.error("Delete product failed", err);
      toast.error("Failed to delete product.");
    }
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
