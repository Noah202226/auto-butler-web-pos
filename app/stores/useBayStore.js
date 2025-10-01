"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { databases, ID } from "../lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const BAYS_COLLECTION_ID = "bayname"; // your bays collection id
const TRANSACTIONS_COLLECTION_ID = "transactions"; // your transactions collection id

export const useBayStore = create(
  persist(
    (set, get) => ({
      bays: [],
      transactions: [],

      // 🔹 Fetch bays
      fetchBays: async () => {
        try {
          const res = await databases.listDocuments(
            DATABASE_ID,
            BAYS_COLLECTION_ID
          );
          set({
            bays: res.documents.map((doc) => ({
              ...doc,
              docId: doc.$id,
            })),
          });
        } catch (err) {
          console.error("❌ Error fetching bays:", err);
        }
      },

      // 🔹 Start new transaction
      startTransaction: async (docId, customerInfo) => {
        try {
          // update bay (only minimal info kept here)
          await databases.updateDocument(
            DATABASE_ID,
            BAYS_COLLECTION_ID,
            docId,
            {
              status: "occupied",
              customerName: customerInfo.name,
              customerPlateNumber: customerInfo.plateNumber,
            }
          );

          // create transaction record (full info here)
          const tx = await databases.createDocument(
            DATABASE_ID,
            TRANSACTIONS_COLLECTION_ID,
            ID.unique(),
            {
              bayId: docId || "id",
              customerName: customerInfo.name || "Default customer name",
              plateNumber: customerInfo.plateNumber || 123,
              vehicle: customerInfo.vehicle || "",
              service: customerInfo.service || "",
              employeeId: customerInfo.employeeId || "",
              employeeName: customerInfo.employeeName || "",
              servicePrice: customerInfo.servicePrice || 0,
              amountReceived: customerInfo.amountReceived || 0,
              change: customerInfo.change || 0,
              companyShare: customerInfo.companyShare || 0,
              employeeShare: customerInfo.employeeShare || 0,
              paymentMethod: customerInfo.paymentMethod || "cash",
              finishedAt: customerInfo.date || new Date(),
              status: "ongoing",
            }
          );

          // update local state
          set((state) => ({
            bays: state.bays.map((b) =>
              b.docId === docId
                ? {
                    ...b,
                    status: "occupied",
                    customerName: customerInfo.name,
                    customerPlateNumber: customerInfo.plateNumber,
                  }
                : b
            ),
            transactions: [...state.transactions, tx],
          }));
        } catch (err) {
          console.error("❌ Error starting transaction:", err);
        }
      },

      // 🔹 Finish transaction
      finishTransaction: async (docId, finishInfo = {}) => {
        try {
          // free the bay
          await databases.updateDocument(
            DATABASE_ID,
            BAYS_COLLECTION_ID,
            docId,
            {
              status: "available",
              customerName: "",
              customerPlateNumber: "",
            }
          );

          // find ongoing transaction for this bay
          const txRes = await databases.listDocuments(
            DATABASE_ID,
            TRANSACTIONS_COLLECTION_ID,
            [Query.equal("bayId", docId), Query.equal("status", "ongoing")]
          );

          if (txRes.documents.length > 0) {
            const tx = txRes.documents[0];
            const updatedTx = await databases.updateDocument(
              DATABASE_ID,
              TRANSACTIONS_COLLECTION_ID,
              tx.$id,
              {
                status: "finished",
                finishedAt: new Date().toISOString(),
                ...finishInfo, // you can pass amountReceived, shares, employee etc. here
              }
            );

            // update local transactions
            set((state) => ({
              transactions: state.transactions.map((t) =>
                t.$id === tx.$id ? updatedTx : t
              ),
            }));
          }

          // update local bays
          set((state) => ({
            bays: state.bays.map((b) =>
              b.docId === docId
                ? {
                    ...b,
                    status: "available",
                    customerName: "",
                    customerPlateNumber: "",
                  }
                : b
            ),
          }));
        } catch (err) {
          console.error("❌ Error finishing transaction:", err);
        }
      },

      // 🔹 Toggle reserve
      toggleReserve: async (docId) => {
        try {
          const bay = get().bays.find((b) => b.docId === docId);
          if (!bay) return;

          const newStatus =
            bay.status === "reserved" ? "available" : "reserved";

          await databases.updateDocument(
            DATABASE_ID,
            BAYS_COLLECTION_ID,
            docId,
            { status: newStatus }
          );

          set((state) => ({
            bays: state.bays.map((b) =>
              b.docId === docId ? { ...b, status: newStatus } : b
            ),
          }));
        } catch (err) {
          console.error("❌ Error toggling reserve:", err);
        }
      },

      // 🔹 Fetch transactions
      getTransactions: async (bayDocId = null) => {
        try {
          const queries = bayDocId ? [Query.equal("bayDocId", bayDocId)] : [];
          const res = await databases.listDocuments(
            DATABASE_ID,
            TRANSACTIONS_COLLECTION_ID,
            queries
          );

          set({ transactions: res.documents });
        } catch (err) {
          console.error("❌ Error fetching transactions:", err);
        }
      },
    }),
    { name: "bay-storage" }
  )
);
