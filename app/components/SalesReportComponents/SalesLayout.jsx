import { CreditCard } from "lucide-react";
import React from "react";
import SummaryReports from "./SummaryReports";
import TransactionsReports from "./TransactionsReports";

function SalesLayout() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-7xl mx-auto">
      {/* Summary + Transactions */}
      <div className="flex flex-col gap-6">
        {/* <SummaryReports /> */}
        <TransactionsReports />
      </div>
    </div>
  );
}

export default SalesLayout;
