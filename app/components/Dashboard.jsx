"use client";

import Sidebar from "../components/Sidebar";
import Dashboard from "../components/MainBoard";
import Settings from "../components/Settings";
import { useSidebarStore } from "../stores/useSidebarStore";

export default function HomePage() {
  const { active } = useSidebarStore();

  return (
    <main className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <section className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        {active === "dashboard" && <Dashboard />}
        {active === "settings" && <Settings />}
      </section>
    </main>
  );
}
