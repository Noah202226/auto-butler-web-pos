"use client";
import {
  X,
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Settings,
  Phone,
} from "lucide-react";
import { useUIStore } from "../stores/useUIStore";
import { useSettingsStore } from "../stores/useSettingsStore";

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, closeSidebar } = useUIStore();
  const { businessName, initial } = useSettingsStore();

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "products", label: "Products", icon: ShoppingCart },
    { key: "sales", label: "Reports", icon: CreditCard },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "contact", label: "Contact", icon: Phone },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-base-100 border-r border-base-300 shadow-lg transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* 🔹 Header / Logo */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-primary text-primary-content font-bold shadow-md">
            {initial}
          </div>
          <span className="font-bold text-lg text-base-content">
            {businessName}
          </span>
        </div>
        <button
          className="md:hidden btn btn-sm btn-ghost"
          onClick={closeSidebar}
        >
          <X size={20} />
        </button>
      </div>

      {/* 🔹 Navigation Links */}
      <nav className="p-4 mt-2 flex flex-col gap-2">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                closeSidebar();
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* 🔹 Footer / Small Logo */}
      <div className="mt-auto p-4 border-t border-base-300 text-center text-xs opacity-60">
        <p>© {new Date().getFullYear()} Auto Butler</p>
      </div>
    </aside>
  );
}
