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

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="p-4 rounded-xl bg-blue-200 shadow">
        <p className="text-sm opacity-80">Total Sales</p>
        <p className="text-2xl font-bold">{totalSales.toLocaleString()}</p>
      </div>

      <div className="p-4 rounded-xl bg-red-200 shadow">
        <p className="text-sm opacity-80">Total Expenses</p>
        <p className="text-2xl font-bold">{totalExpenses.toLocaleString()}</p>
      </div>

      <div className="p-4 rounded-xl bg-green-200 shadow">
        <p className="text-sm opacity-80">Net Profit</p>
        <p className="text-2xl font-bold">{netProfit.toLocaleString()}</p>
      </div>
    </div>
  );
}
