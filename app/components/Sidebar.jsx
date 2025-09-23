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

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, closeSidebar } = useUIStore();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-base-100 border-r border-base-300 shadow-md transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo + Close btn (mobile only) */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-content font-bold">
            CW
          </div>
          <span className="font-bold text-lg">CarWash POS</span>
        </div>
        <button
          className="md:hidden btn btn-sm btn-ghost"
          onClick={closeSidebar}
        >
          <X size={20} />
        </button>
      </div>

      {/* Sidebar nav */}
      <nav className="p-4 space-y-2">
        {[
          { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { key: "products", label: "Products", icon: ShoppingCart },
          { key: "sales", label: "Sales", icon: CreditCard },
          { key: "settings", label: "Settings", icon: Settings },
          { key: "contact", label: "Contact", icon: Phone },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActiveTab(item.key);
              closeSidebar();
            }}
            className={`flex items-center w-full px-3 py-2 rounded-lg ${
              activeTab === item.key
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200"
            }`}
          >
            <item.icon size={18} className="mr-2" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
