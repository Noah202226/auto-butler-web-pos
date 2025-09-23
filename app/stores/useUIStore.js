"use client";
import { create } from "zustand";

export const useUIStore = create((set) => ({
  activeTab: "dashboard",
  sidebarOpen: false,

  // actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
}));
