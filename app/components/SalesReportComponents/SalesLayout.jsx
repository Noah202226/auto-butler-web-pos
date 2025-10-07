import React from "react";
import TransactionsReports from "./TransactionsReports";

function SalesLayout() {
  return (
    <div className="w-full">
      <div className="card bg-base-200 border border-base-300 shadow-xl rounded-2xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Reports & Analytics
          </h1>
          <p className="text-base-content/70 text-sm mb-4">
            Review your daily, weekly, and monthly sales and expenses. Export
            reports as PDF anytime.
          </p>
          <TransactionsReports />
        </div>
      </div>
    </div>
  );
}

export default SalesLayout;
