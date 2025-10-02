import { create } from "zustand";
import { databases, ID } from "../lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const SETTINGS_COLLECTION_ID = "settings";

export const useSettingsStore = create((set, get) => ({
  businessName: "Auto Butler",
  themeColor: "#4f46e5",
  logo: null,
  docId: null,

  // Load
  fetchSettings: async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        SETTINGS_COLLECTION_ID
      );
      if (res.documents.length > 0) {
        const doc = res.documents[0];
        set({
          docId: doc.$id,
          businessName: doc.businessName,
          themeColor: doc.themeColor,
          logo: doc.logo,
        });
      }
    } catch (err) {
      console.error("Fetch settings failed", err);
    }
  },

  // Save
  saveSettings: async () => {
    const { docId, businessName, themeColor, logo } = get();
    const payload = { businessName, themeColor, logo };

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
    } catch (err) {
      console.error("Save settings failed", err);
    }
  },
}));
