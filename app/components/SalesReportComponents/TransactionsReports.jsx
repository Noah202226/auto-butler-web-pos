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
    <div className="bg-base-100 text-base-content rounded-2xl shadow-lg border border-base-300 p-3 sm:p-4">
      {/* Tabs */}
      <div className="tabs mb-3 overflow-x-auto">
        <a
          className={`tab tab-bordered sm:mx-5 ${
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-base-200 p-4 rounded-xl mb-6 border border-base-300">
        <div>
          <label className="label-text font-medium mb-1 block">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input input-bordered input-sm w-full"
          />
        </div>
        <div>
          <label className="label-text font-medium mb-1 block">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input input-bordered input-sm w-full"
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
              className="select select-bordered select-sm w-full"
            >
              <option value="">All</option>
              {[...new Set(sales.map((s) => s.employeeName))].map((emp) => (
                <option key={emp}>{emp}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-end">
          <button
            onClick={downloadPDF}
            disabled={actionLoading || loading}
            className="btn btn-primary btn-sm w-full"
          >
            {actionLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "📄 Download PDF"
            )}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
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
            className="bg-base-200 rounded-xl p-3 text-center border border-base-300"
          >
            <p className="text-sm text-base-content/70">{stat.title}</p>
            <h3 className={`text-lg font-bold ${stat.color}`}>
              ₱{stat.value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      {/* Data Display */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : activeTab === "sales" ? (
        filteredSales.length ? (
          <>
            {/* Table for desktop */}
            <div className="hidden sm:block overflow-x-auto">
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

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-3">
              {filteredSales.map((s) => (
                <div
                  key={s.$id}
                  className="bg-base-200 rounded-lg p-4 border border-base-300"
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">{s.customerName}</p>
                    <p className="text-xs text-gray-400">{s.status}</p>
                  </div>
                  <p className="text-sm text-gray-400">{s.vehicle}</p>
                  <p className="text-sm">{s.service}</p>
                  <p className="text-xs text-gray-500">
                    Employee:{" "}
                    <span className="text-gray-300">{s.employeeName}</span>
                  </p>
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-blue-400 font-medium">
                      ₱{s.employeeShare}
                    </span>
                    <span className="text-pink-400 font-medium">
                      ₱{s.companyShare}
                    </span>
                  </div>
                  <div className="text-right pt-2">
                    <button
                      disabled={actionLoading}
                      onClick={() => {
                        setConfirmMessage(
                          `Delete sale record for ${s.customerName}?`
                        );
                        setConfirmAction(() => async () => {
                          try {
                            setActionLoading(true);
                            await deleteSale(s.$id);
                            toast.success("Sale deleted");
                          } catch {
                            toast.error("Failed to delete sale");
                          } finally {
                            setActionLoading(false);
                          }
                        });
                        setConfirmOpen(true);
                      }}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-base-content/60 mt-6">
            No sales records found.
          </p>
        )
      ) : filteredExpenses.length ? (
        <>
          <div className="hidden sm:block overflow-x-auto">
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

          {/* Mobile expense cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {filteredExpenses.map((e) => (
              <div
                key={e.$id}
                className="bg-base-200 rounded-lg p-4 border border-base-300"
              >
                <div className="flex justify-between">
                  <p className="font-semibold">{e.category}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(e.$createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-gray-400">{e.note}</p>
                <p className="text-lg font-bold text-error mt-2">
                  ₱{e.amount.toLocaleString()}
                </p>
                <div className="text-right pt-2">
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
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
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
