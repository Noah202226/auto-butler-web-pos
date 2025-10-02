// stores/useServiceStore.js
import { create } from "zustand";
import { databases } from "../lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = "68dd10f9001a68982ac8"; // your DB ID
const SERVICES_COLLECTION_ID = "services"; // collection ID

export const useServiceStore = create((set, get) => ({
  services: [],
  loading: false,
  error: null,

  // Fetch all services
  fetchServices: async () => {
    try {
      set({ loading: true, error: null });
      const res = await databases.listDocuments(
        DATABASE_ID,
        SERVICES_COLLECTION_ID,
        [Query.orderAsc("serviceName")]
      );
      set({ services: res.documents });
    } catch (error) {
      console.error("Error fetching services:", error);
      set({ error: "Failed to load services" });
    } finally {
      set({ loading: false });
    }
  },

  // Add new service
  addService: async (serviceData) => {
    try {
      const res = await databases.createDocument(
        DATABASE_ID,
        SERVICES_COLLECTION_ID,
        "unique()", // let Appwrite auto-generate ID
        serviceData
      );
      set({ services: [...get().services, res] });
      return res;
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, SERVICES_COLLECTION_ID, id);
      set({ services: get().services.filter((s) => s.$id !== id) });
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },
}));
