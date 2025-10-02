// SummaryReports.tsx
"use client";
import useSalesStore from "../../stores/useSaleStore";
import { useEffect } from "react";

export default function SummaryReports() {
  const { sales, expenses, fetchSales, fetchExpenses, loading } =
    useSalesStore();

  useEffect(() => {
    fetchSales();
    fetchExpenses();
  }, [fetchSales, fetchExpenses]);

  const totalSales = sales.reduce((acc, s) => acc + (s.amount || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const netProfit = totalSales - totalExpenses;

  const cards = [
    {
      title: "Total Sales",
      value: `₱${totalSales.toLocaleString()}`,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Expenses",
      value: `₱${totalExpenses.toLocaleString()}`,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Net Profit",
      value: `₱${netProfit.toLocaleString()}`,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((c) => (
        <div
          key={c.title}
          className={`p-5 rounded-2xl shadow-md bg-gradient-to-r ${c.color} text-white`}
        >
          <p className="text-sm opacity-90">{c.title}</p>
          <p className="text-3xl font-bold mt-1">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
