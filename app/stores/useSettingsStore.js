import { create } from "zustand";
import { databases, ID } from "../lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const SETTINGS_COLLECTION_ID = "settings"; // your collection name

export const useSettingsStore = create((set, get) => ({
  businessName: "Auto Butler",
  initial: "A",
  docId: null,
  loading: false,

  // ✅ Load settings once
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        SETTINGS_COLLECTION_ID
      );

      if (res.documents.length > 0) {
        const doc = res.documents[0];
        set({
          docId: doc.$id,
          businessName: doc.businessName || "Auto Butler",
          initial:
            doc.initial || (doc.businessName ? doc.businessName[0] : "A"),
        });
      }
    } catch (err) {
      console.error("Fetch settings failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Save and instantly update store
  saveSettings: async () => {
    const { docId, businessName, initial } = get();
    const payload = { businessName, initial };

    try {
      if (docId) {
        await databases.updateDocument(
          DATABASE_ID,
          SETTINGS_COLLECTION_ID,
          docId,
          payload
        );
      } else {
        const newDoc = await databases.createDocument(
          DATABASE_ID,
          SETTINGS_COLLECTION_ID,
          ID.unique(),
          payload
        );
        set({ docId: newDoc.$id });
      }

      // ✅ Instantly update local store (no reload)
      set({ businessName, initial });
      console.log("✅ Settings saved successfully:", businessName, initial);
    } catch (err) {
      console.error("Save settings failed:", err);
    }
  },

  // ✅ Mutators for UI bindings
  setBusinessName: (name) => set({ businessName: name }),
  setInitial: (char) => set({ initial: char }),
}));
