"use client";

import { useSidebarStore } from "../stores/useSidebarStore";

export default function Sidebar() {
  const { active, setActive } = useSidebarStore();

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-purple-900 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">AutoDetail POS</h1>
      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => setActive(item.key)}
              className={`btn btn-ghost justify-start w-full ${
                active === item.key ? "bg-purple-700" : ""
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
