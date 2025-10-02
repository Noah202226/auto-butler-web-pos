"use client";
import { useEffect, useState } from "react";
import {
  Menu,
  Plus,
  X,
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Settings,
  Phone,
  Car,
  Receipt,
} from "lucide-react";
import Sidebar from "./Sidebar";

import { useUIStore } from "../stores/useUIStore";
import { useAuthStore } from "../stores/authStore";
import Dashboard from "./Dashboard";
import SummaryReports from "./SalesReportComponents/SummaryReports";
import AddExpenseModal from "./Helpers/AddExpenseModal";
import TransactionsReports from "./SalesReportComponents/TransactionsReports";
import SalesLayout from "./SalesReportComponents/SalesLayout";
import SettingsLayout from "./SettingsComponents/SettingsLayout";

export default function Layout() {
  const { activeTab, openSidebar } = useUIStore();
  const [fabOpen, setFabOpen] = useState(false);

  const { logout } = useAuthStore();

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between bg-base-100 border-b border-base-300 shadow-sm p-4">
          {/* Left: Hamburger + Logo (mobile only) */}
          <div className="flex items-center gap-3">
            <button
              onClick={openSidebar}
              className="md:hidden btn btn-ghost btn-sm"
            >
              <Menu size={20} />
            </button>
            <div className="md:hidden flex items-center gap-2 font-bold text-lg">
              <span>Auto Buttler</span>
            </div>
          </div>

          {/* Center: Date + Time (always visible) */}
          <div className="flex-1 text-center">
            <div className="text-xs sm:text-sm font-medium text-base-content/70 tracking-wide">
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

          {/* Right: Actions + Avatar */}
          <div className="flex items-center gap-2">
            {/* Action buttons (hidden on mobile) */}
            <div className="hidden md:flex gap-2">
              <button className="btn btn-primary btn-sm">+ New Wash</button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  document.getElementById("expense_modal").showModal()
                }
              >
                + Expense
              </button>
            </div>

            <AddExpenseModal />

            {/* User Menu */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar placeholder btn btn-ghost btn-circle"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold shadow-md text-white">
                  CW
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-2"
              >
                <li>
                  <button onClick={() => logout()}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Main Page */}
        <main className="flex flex-col h-screen flex-1 overflow-y-auto p-2 w-full">
          {activeTab === "dashboard" && (
            <div className="font-semibold">
              <Dashboard />
            </div>
          )}
          {activeTab === "products" && (
            <div className="text-xl font-semibold flex items-center">
              <ShoppingCart className="mr-2" /> Products Content
            </div>
          )}
          {activeTab === "sales" && <SalesLayout />}
          {activeTab === "settings" && <SettingsLayout />}
          {activeTab === "contact" && (
            <div className="text-xl font-semibold flex items-center">
              <Phone className="mr-2" /> Contact Content --- Upcoming features
            </div>
          )}
        </main>
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <div className="relative flex flex-col items-end">
          {/* Expanded Actions */}
          {fabOpen && (
            <div className="mb-2 space-y-2">
              <button className="btn btn-primary btn-sm w-32 flex items-center justify-start gap-2">
                <Car size={16} /> New Wash
              </button>
              <button
                onClick={() =>
                  document.getElementById("expense_modal").showModal()
                }
                className="btn btn-secondary btn-sm w-32 flex items-center justify-start gap-2"
              >
                <Receipt size={16} /> Expense
              </button>
            </div>
          )}

          {/* FAB Toggle */}
          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="btn btn-primary btn-circle shadow-lg"
          >
            {fabOpen ? <X size={22} /> : <Plus size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
}
