"use client";
import { useEffect, useState, useMemo } from "react";
import useSalesStore from "../../stores/useSaleStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ConfirmModal from "../Helpers/ConfirmModal";
import toast from "react-hot-toast";

export default function TransactionsReports() {
  const {
    sales,
    expenses,
    fetchSales,
    fetchExpenses,
    deleteSale,
    deleteExpense,
    loading,
  } = useSalesStore();

  const [activeTab, setActiveTab] = useState("sales");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [actionLoading, setActionLoading] = useState(false);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  useEffect(() => {
    fetchSales();
    fetchExpenses();
  }, [fetchSales, fetchExpenses]);

  // Filters
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const date = new Date(s.$createdAt);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      return (
        (!from || date >= from) &&
        (!to || date <= to) &&
        (!employeeFilter || s.employeeName === employeeFilter)
      );
    });
  }, [sales, dateFrom, dateTo, employeeFilter]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.date || e.$createdAt);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      return (!from || date >= from) && (!to || date <= to);
    });
  }, [expenses, dateFrom, dateTo]);

  // Totals
  const totalSales = filteredSales.reduce((a, s) => a + s.servicePrice, 0);
  const totalExpenses = filteredExpenses.reduce(
    (a, e) => a + (e.amount || 0),
    0
  );
  const netProfit = totalSales - totalExpenses;
  const totalEmployeeShare = filteredSales.reduce(
    (a, s) => a + (s.employeeShare || 0),
    0
  );
  const totalCompanyShare = filteredSales.reduce(
    (a, s) => a + (s.companyShare || 0),
    0
  );

  // PDF export
  const downloadPDF = async () => {
    setActionLoading(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Auto Butler — Transaction Report", 14, 15);
      doc.setFontSize(11);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);

      let y = 35;
      if (dateFrom)
        doc.text(`From: ${new Date(dateFrom).toLocaleDateString()}`, 14, y);
      if (dateTo)
        doc.text(`To: ${new Date(dateTo).toLocaleDateString()}`, 14, (y += 7));
      if (employeeFilter) doc.text(`Employee: ${employeeFilter}`, 14, (y += 7));

      y += 10;
      doc.text(`Total Sales: ₱${totalSales.toLocaleString()}`, 14, y);
      doc.text(`Expenses: ₱${totalExpenses.toLocaleString()}`, 14, (y += 7));
      doc.text(`Net Profit: ₱${netProfit.toLocaleString()}`, 14, (y += 7));
      doc.text(
        `Employee Share: ₱${totalEmployeeShare.toLocaleString()}`,
        14,
        (y += 7)
      );
      doc.text(
        `Company Share: ₱${totalCompanyShare.toLocaleString()}`,
        14,
        (y += 7)
      );

      y += 10;
      doc.setFontSize(14);
      doc.text(
        activeTab === "sales" ? "Sales Records" : "Expense Records",
        14,
        y
      );
      autoTable(doc, {
        startY: y + 5,
        head:
          activeTab === "sales"
            ? [
                [
                  "Customer",
                  "Vehicle",
                  "Service",
                  "Employee",
                  "Amount",
                  "Status",
                ],
              ]
            : [["Name", "Category", "Note", "Amount", "Date"]],
        body:
          activeTab === "sales"
            ? filteredSales.map((s) => [
                s.customerName,
                `${s.vehicle} (${s.plateNumber})`,
                s.service,
                s.employeeName,
                `₱${(s.servicePrice || 0).toLocaleString()}`,
                s.status,
              ])
            : filteredExpenses.map((e) => [
                e.name,
                e.category,
                e.note,
                `₱${e.amount.toLocaleString()}`,
                new Date(e.date || e.$createdAt).toLocaleDateString(),
              ]),
        styles: { fontSize: 10 },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
        },
      });
      doc.save("transaction_report.pdf");
      toast.success("PDF downloaded");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-base-100 text-base-content rounded-2xl shadow-lg border border-base-300 p-2">
      {/* Tabs */}
      <div className="tabs mb-2">
        <a
          className={`tab tab-bordered mx-5 ${
            activeTab === "sales" ? "tab-active font-semibold" : ""
          }`}
          onClick={() => setActiveTab("sales")}
        >
          Sales
        </a>
        <a
          className={`tab tab-bordered ${
            activeTab === "expenses" ? "tab-active font-semibold" : ""
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 bg-base-200 p-4 rounded-xl mb-6 border border-base-300">
        <div>
          <label className="label-text font-medium mb-1 block">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input input-bordered input-sm w-44"
          />
        </div>
        <div>
          <label className="label-text font-medium mb-1 block">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input input-bordered input-sm w-44"
          />
        </div>
        {activeTab === "sales" && (
          <div>
            <label className="label-text font-medium mb-1 block">
              Employee
            </label>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="select select-bordered select-sm w-52"
            >
              <option value="">All</option>
              {[...new Set(sales.map((s) => s.employeeName))].map((emp) => (
                <option key={emp}>{emp}</option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={downloadPDF}
          disabled={actionLoading || loading}
          className="btn btn-primary btn-sm ml-auto"
        >
          {actionLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "📄 Download PDF"
          )}
        </button>
      </div>

      {/* Summary */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max">
          {[
            { title: "Total Sales", value: totalSales, color: "text-primary" },
            {
              title: "Total Expenses",
              value: totalExpenses,
              color: "text-error",
            },
            { title: "Net Profit", value: netProfit, color: "text-success" },
            {
              title: "Employee Share",
              value: totalEmployeeShare,
              color: "text-info",
            },
            {
              title: "Company Share",
              value: totalCompanyShare,
              color: "text-secondary",
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="stat bg-base-200 rounded-xl px-4 min-w-[180px]"
            >
              <div className="stat-title text-sm">{stat.title}</div>
              <div className={`stat-value ${stat.color}`}>
                ₱{stat.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Display */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : activeTab === "sales" ? (
        filteredSales.length ? (
          <div className="overflow-x-auto mt-6">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr className="text-base-content/80">
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Service</th>
                  <th>Employee</th>
                  <th>Employee Share</th>
                  <th>Company Share</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((e) => (
                  <tr key={e.$id}>
                    <td>{e.customerName}</td>
                    <td>{e.vehicle}</td>
                    <td>{e.service}</td>
                    <td>{e.employeeName}</td>
                    <td>₱{e.employeeShare}</td>
                    <td>₱{e.companyShare}</td>
                    <td>{e.status}</td>
                    <td>{new Date(e.$createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        disabled={actionLoading}
                        onClick={() => {
                          setConfirmMessage(
                            `Delete sale record for ${e.customerName}?`
                          );
                          setConfirmAction(() => async () => {
                            try {
                              setActionLoading(true);
                              await deleteSale(e.$id);
                              toast.success("Sale deleted");
                            } catch {
                              toast.error("Failed to delete sale");
                            } finally {
                              setActionLoading(false);
                            }
                          });
                          setConfirmOpen(true);
                        }}
                        className="btn btn-error btn-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-base-content/60 mt-6">
            No sales records found.
          </p>
        )
      ) : filteredExpenses.length ? (
        <div className="overflow-x-auto mt-6">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="text-base-content/80">
                <th>Category</th>
                <th>Note</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((e) => (
                <tr key={e.$id}>
                  <td>{e.category}</td>
                  <td>{e.note}</td>
                  <td>₱{e.amount.toLocaleString()}</td>
                  <td>{new Date(e.$createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      disabled={actionLoading}
                      onClick={() => {
                        setConfirmMessage(`Delete expense: ${e.category}?`);
                        setConfirmAction(() => async () => {
                          try {
                            setActionLoading(true);
                            await deleteExpense(e.$id);
                            toast.success("Expense deleted");
                          } catch {
                            toast.error("Failed to delete expense");
                          } finally {
                            setActionLoading(false);
                          }
                        });
                        setConfirmOpen(true);
                      }}
                      className="btn btn-error btn-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-base-content/60 mt-6">
          No expense records found.
        </p>
      )}

      <ConfirmModal
        show={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
        message={confirmMessage}
      />
    </div>
  );
}
