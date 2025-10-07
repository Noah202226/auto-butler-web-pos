"use client";
import { useEffect, useState } from "react";
import { Menu, Plus, X, Car, Receipt, Phone } from "lucide-react";
import Sidebar from "./Sidebar";

import { useUIStore } from "../stores/useUIStore";
import { useAuthStore } from "../stores/authStore";
import { useSettingsStore } from "../stores/useSettingsStore";

import Dashboard from "./Dashboard";
import SalesLayout from "./SalesReportComponents/SalesLayout";
import SettingsLayout from "./SettingsComponents/SettingsLayout";
import ProductsLayout from "./ProductsComponent/ProductsLayout";
import AddExpenseModal from "./Helpers/AddExpenseModal";

export default function Layout() {
  const { activeTab, openSidebar } = useUIStore();
  const { logout } = useAuthStore();
  const { businessName, initial, fetchSettings } = useSettingsStore();

  const [fabOpen, setFabOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="flex h-screen bg-base-200 text-base-content overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-base-100 border-b border-base-300 shadow-md px-4 py-3">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={openSidebar}
              className="md:hidden btn btn-ghost btn-sm"
            >
              <Menu size={20} />
            </button>
            <div className="md:hidden font-bold text-lg">
              {businessName + "test" || "Company Name"}
            </div>
          </div>

          {/* Center: Date + Time */}
          <div className="flex-1 text-center">
            <div className="text-xs sm:text-sm text-base-content/70 tracking-wide">
              {dateTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="text-lg sm:text-xl font-semibold text-primary tracking-wider animate-pulse">
              {dateTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>

          {/* Right: Actions + User */}
          <div className="flex items-center gap-2">
            {/* Buttons (Desktop) */}
            <div className="hidden md:flex gap-2">
              {/* <button className="btn btn-primary btn-sm shadow-md hover:shadow-lg transition-all">
                + New Wash
              </button> */}
              <button
                className="btn btn-secondary btn-sm shadow-md hover:shadow-lg transition-all"
                onClick={() =>
                  document.getElementById("expense_modal").showModal()
                }
              >
                + Expense
              </button>
            </div>

            <AddExpenseModal />

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar placeholder btn btn-ghost btn-circle"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold shadow-md">
                  {initial}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-2"
              >
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Main Page */}
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "products" && <ProductsLayout />}
          {activeTab === "sales" && <SalesLayout />}
          {activeTab === "settings" && <SettingsLayout />}

          {/* Sampele contact tab */}
          {activeTab === "contact" && (
            <div className="p-6 w-full">
              <div className="card bg-base-200 shadow-lg border border-base-300">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone size={20} className="text-primary" />
                    <h2 className="text-xl font-semibold text-base-content/90">
                      Contact & Support
                    </h2>
                  </div>

                  <p className="text-base-content/70 mb-4">
                    Manage your business contact details, support channels, and
                    messaging preferences here. New features are coming soon to
                    help you easily handle customer inquiries and feedback.
                  </p>

                  {/* Placeholder Section for Future Features */}
                  <div className="p-4 rounded-lg bg-base-300 border border-dashed border-base-400 flex flex-col items-center justify-center text-center">
                    <span className="font-medium text-base-content/80">
                      📞 Contact Management Module — Coming Soon
                    </span>
                    <p className="text-sm text-base-content/60 mt-1">
                      Stay tuned for tools to manage customer communication and
                      service records directly from your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 🔹 Floating Action Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <div className="relative flex flex-col items-end">
          {fabOpen && (
            <div className="mb-2 space-y-2">
              {/* <button className="btn btn-primary btn-sm w-32 flex items-center justify-start gap-2 shadow-md">
                <Car size={16} /> New Wash
              </button> */}
              <button
                onClick={() =>
                  document.getElementById("expense_modal").showModal()
                }
                className="btn btn-secondary btn-sm w-32 flex items-center justify-start gap-2 shadow-md"
              >
                <Receipt size={16} /> Expense
              </button>
            </div>
          )}

          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="btn btn-primary btn-circle shadow-lg hover:shadow-xl transition-all"
          >
            {fabOpen ? <X size={22} /> : <Plus size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
}
