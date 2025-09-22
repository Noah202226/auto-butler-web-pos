import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  active: "dashboard",
  setActive: (section) => set({ active: section }),
}));
