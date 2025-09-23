import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBayStore = create(
  persist(
    (set, get) => ({
      bays: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        status: "available",
        customer: null,
      })),

      // 🔹 Start new transaction
      startTransaction: (id, customerInfo) =>
        set((state) => ({
          bays: state.bays.map((b) =>
            b.id === id
              ? { ...b, status: "occupied", customer: customerInfo }
              : b
          ),
        })),

      // 🔹 Finish transaction (back to available)
      finishTransaction: (id) =>
        set((state) => ({
          bays: state.bays.map((b) =>
            b.id === id ? { ...b, status: "available", customer: null } : b
          ),
        })),

      // 🔹 Toggle reserve
      toggleReserve: (id) =>
        set((state) => ({
          bays: state.bays.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: b.status === "reserved" ? "available" : "reserved",
                }
              : b
          ),
        })),
    }),
    {
      name: "bay-storage", // 🔹 key sa localStorage
    }
  )
);
