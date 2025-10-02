"use client";
import { useEffect } from "react";
import useTransactionStore from "../../stores/useTransactionStore";

export default function TransactionsReports() {
  const { transactions, totalSales, fetchTransactions, loading } =
    useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Sales Report</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="text-lg">
            <span className="font-bold">Total Sales:</span>{" "}
            <span className="text-green-600">
              ₱{totalSales.toLocaleString()}
            </span>
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Service</th>
                  <th>Employee</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.$id}>
                    <td>{t.customerName}</td>
                    <td>
                      {t.vehicle} ({t.plateNumber})
                    </td>
                    <td>{t.service}</td>
                    <td>{t.employeeName}</td>
                    <td>
                      ₱{(t.amountReceived || t.servicePrice).toLocaleString()}
                    </td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
