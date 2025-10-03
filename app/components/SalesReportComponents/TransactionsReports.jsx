"use client";
import { useEffect, useState, useMemo } from "react";
import useSalesStore from "../../stores/useSaleStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ import the actual function
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

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  useEffect(() => {
    fetchSales();
    fetchExpenses();
  }, [fetchSales, fetchExpenses]);

  // Filtered Data
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
  const totalSales = filteredSales.reduce((acc, s) => acc + s.servicePrice, 0);
  const totalExpenses = filteredExpenses.reduce(
    (acc, e) => acc + (e.amount || 0),
    0
  );
  const netProfit = totalSales - totalExpenses;

  // Extra Totals for Sales
  const totalEmployeeShare = filteredSales.reduce(
    (acc, s) => acc + (s.employeeShare || 0),
    0
  );
  const totalCompanyShare = filteredSales.reduce(
    (acc, s) => acc + (s.companyShare || 0),
    0
  );

  const downloadPDF = () => {
    const doc = new jsPDF();

    // 🏷 Title
    doc.setFontSize(18);
    doc.text("Auto Butler - Transaction Report", 14, 15);

    // 📅 Metadata
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 25);

    // 🧾 Filters applied
    let filterY = 35;
    if (dateFrom)
      doc.text(`From: ${new Date(dateFrom).toLocaleDateString()}`, 14, filterY);
    if (dateTo) {
      filterY += 7;
      doc.text(`To: ${new Date(dateTo).toLocaleDateString()}`, 14, filterY);
    }
    if (employeeFilter) {
      filterY += 7;
      doc.text(`Employee: ${employeeFilter}`, 14, filterY);
    }

    // Totals
    filterY += 12;
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Total Sales: ₱${totalSales.toLocaleString()}`, 14, filterY);
    filterY += 7;
    doc.text(`Total Expenses: ₱${totalExpenses.toLocaleString()}`, 14, filterY);
    filterY += 7;
    doc.text(`Net Profit: ₱${netProfit.toLocaleString()}`, 14, filterY);

    if (activeTab === "sales") {
      filterY += 7;
      doc.text(
        `Employee Share: ₱${totalEmployeeShare.toLocaleString()}`,
        14,
        filterY
      );
      filterY += 7;
      doc.text(
        `Company Share: ₱${totalCompanyShare.toLocaleString()}`,
        14,
        filterY
      );
    }

    let finalY = filterY + 10;

    // 📊 Tables
    if (activeTab === "sales") {
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text("Sales Records", 14, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        head: [
          ["Customer", "Vehicle", "Service", "Employee", "Amount", "Status"],
        ],
        body: filteredSales.map((s) => [
          s.customerName,
          `${s.vehicle} (${s.plateNumber})`,
          s.service,
          s.employeeName,
          `₱${(s.amountReceived || s.servicePrice || 0).toLocaleString()}`,
          s.status,
        ]),
        styles: { fontSize: 10 },
        headStyles: {
          fillColor: [59, 130, 246], // blue
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 10 },
      });

      // 👥 Employee Breakdown (if no specific employee selected)
      if (!employeeFilter) {
        const employeeBreakdown = {};

        filteredSales.forEach((s) => {
          if (!employeeBreakdown[s.employeeName]) {
            employeeBreakdown[s.employeeName] = {
              employeeShare: 0,
              companyShare: 0,
            };
          }
          employeeBreakdown[s.employeeName].employeeShare +=
            s.employeeShare || 0;
          employeeBreakdown[s.employeeName].companyShare += s.companyShare || 0;
        });

        const breakdownTable = Object.entries(employeeBreakdown).map(
          ([name, values]) => [
            name,
            `₱${values.employeeShare.toLocaleString()}`,
            `₱${values.companyShare.toLocaleString()}`,
            `₱${(values.employeeShare + values.companyShare).toLocaleString()}`,
          ]
        );

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 15,
          head: [["Employee", "Employee Share", "Company Share", "Total"]],
          body: breakdownTable,
          styles: { fontSize: 10 },
          headStyles: {
            fillColor: [16, 185, 129], // green
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: { fillColor: [245, 250, 245] },
        });
      }
    } else {
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text("Expense Records", 14, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        head: [["Name", "Category", "Note", "Amount", "Date"]],
        body: filteredExpenses.map((e) => [
          e.name,
          e.category,
          e.note,
          `₱${e.amount.toLocaleString()}`,
          new Date(e.date || e.$createdAt).toLocaleDateString(),
        ]),
        styles: { fontSize: 10 },
        headStyles: {
          fillColor: [239, 68, 68], // red
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { top: 10 },
      });
    }

    // 💾 Save PDF
    doc.save("transaction_report.pdf");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reports</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "sales"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sales
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "expenses"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-6 mb-6 bg-[var(--theme-text-muted)] p-4 rounded-xl shadow-sm">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">From</span>
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input input-bordered input-primary w-44"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">To</span>
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input input-bordered input-primary w-44"
          />
        </div>

        {activeTab === "sales" && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Employee</span>
            </label>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="select select-bordered select-primary w-52"
            >
              <option value="">All</option>
              {[...new Set(sales.map((s) => s.employeeName))].map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {dateFrom && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            From: {new Date(dateFrom).toLocaleDateString()}
          </span>
        )}
        {dateTo && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            To: {new Date(dateTo).toLocaleDateString()}
          </span>
        )}
        {employeeFilter && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Employee: {employeeFilter}
          </span>
        )}
        {!dateFrom && !dateTo && !employeeFilter && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            No filters applied
          </span>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-xl font-bold text-blue-700">
            ₱{totalSales.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-xl font-bold text-red-700">
            ₱{totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Net Profit</p>
          <p className="text-xl font-bold text-green-700">
            ₱{netProfit.toLocaleString()}
          </p>
        </div>

        {/* Extra Sales Summary */}
        {activeTab === "sales" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-yellow-50 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600">Total Employee Share</p>
              <p className="text-xl font-bold text-yellow-700">
                ₱{totalEmployeeShare.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600">Total Company Share</p>
              <p className="text-xl font-bold text-purple-700">
                ₱{totalCompanyShare.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Download PDF button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md text-sm"
        >
          📄 Download PDF
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : activeTab === "sales" ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl border text-black border-gray-200 shadow-sm overflow-hidden">
              <table className="table w-full">
                <thead className="bg-gray-100 text-black">
                  <tr>
                    {/* <th className="px-4 py-2 text-left">BayId</th> */}
                    <th className="px-4 py-2 text-left">Customer Name</th>
                    <th className="px-4 py-2 text-left">Vehicle</th>
                    <th className="px-4 py-2 text-left">Service</th>
                    <th className="px-4 py-2 text-left">Service Price</th>
                    <th className="px-4 py-2 text-left">Employee</th>
                    <th className="px-4 py-2 text-left">Employee Share</th>
                    <th className="px-4 py-2 text-left">Company Share</th>
                    {/* <th className="px-4 py-2 text-left">Amount Received</th> */}
                    {/* <th className="px-4 py-2 text-left">Change</th> */}
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((e) => (
                    <tr key={e.$id} className="border-t">
                      {/* <td className="px-4 py-2">{e.bayId}</td> */}
                      <td className="px-4 py-2">{e.customerName}</td>
                      <td className="px-4 py-2">
                        {e.vehicle} <span>({e.vehicle})</span>
                      </td>
                      <td className="px-4 py-2">{e.service}</td>
                      <td className="px-4 py-2">{e.servicePrice}</td>
                      <td className="px-4 py-2">{e.employeeName}</td>
                      <td className="px-4 py-2">{e.employeeShare}</td>
                      <td className="px-4 py-2">{e.companyShare}</td>
                      {/* <td className="px-4 py-2">
                        ₱{e.amountReceived.toLocaleString()}
                      </td> */}
                      {/* <td className="px-4 py-2">
                        ₱{e.change.toLocaleString()}
                      </td> */}
                      <td className="px-4 py-2">{e.status}</td>
                      <td className="px-4 py-2">
                        {new Date(e.$createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setConfirmMessage(
                              `Are you sure you want to delete sale for ${e.customerName}?`
                            );
                            setConfirmAction(() => async () => {
                              try {
                                await deleteSale(e.$id);
                                toast.success("✅ Sale deleted successfully");
                              } catch (err) {
                                console.error(err);
                                toast.error("❌ Failed to delete sale");
                              }
                            });
                            setConfirmOpen(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs shadow-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
              {filteredSales.length === 0 ? (
                <p className="text-gray-500 text-center">No sales records</p>
              ) : (
                filteredSales.map((item) => (
                  <div
                    key={item.$id}
                    className="p-4 bg-white rounded-xl shadow border border-gray-200"
                  >
                    <p className="font-semibold text-gray-800">
                      {item.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.vehicle} ({item.plateNumber})
                    </p>
                    <p className="text-sm text-gray-600">
                      Service: {item.service}
                    </p>
                    <p className="text-sm text-gray-600">
                      Employee: {item.employeeName}
                    </p>
                    <p className="text-sm font-bold text-blue-600">
                      ₱
                      {(
                        item.amountReceived ||
                        item.servicePrice ||
                        0
                      ).toLocaleString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold ${
                        item.status === "finished"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setConfirmMessage(
                            `Are you sure you want to delete sale for ${e.customerName}?`
                          );
                          setConfirmAction(() => async () => {
                            try {
                              await deleteSale(e.$id);
                              toast.success("✅ Sale deleted successfully");
                            } catch (err) {
                              console.error(err);
                              toast.error("❌ Failed to delete sale");
                            }
                          });
                          setConfirmOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl border border-gray-200 text-black shadow-sm overflow-hidden">
              <table className="table w-full">
                <thead className="bg-gray-100 text-black">
                  <tr>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Note</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((e) => (
                    <tr key={e.$id} className="border-t">
                      <td className="px-4 py-2">{e.category}</td>
                      <td className="px-4 py-2">{e.note}</td>
                      <td className="px-4 py-2">
                        {new Date(e.$createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        ₱{e.amount.toLocaleString()}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setConfirmMessage(
                              `Are you sure you want to delete expense: ${e.category}?`
                            );
                            setConfirmAction(() => async () => {
                              try {
                                await deleteExpense(e.$id);
                                toast.success(
                                  "✅ Expense deleted successfully"
                                );
                              } catch (err) {
                                console.error(err);
                                toast.error("❌ Failed to delete expense");
                              }
                            });
                            setConfirmOpen(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs shadow-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
              {filteredExpenses.length === 0 ? (
                <p className="text-gray-500 text-center">No expenses records</p>
              ) : (
                filteredExpenses.map((item) => (
                  <div
                    key={item.$id}
                    className="p-4 bg-white rounded-xl shadow border border-gray-200"
                  >
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Category: {item.category}
                    </p>
                    <p className="text-sm text-gray-600">Note: {item.note}</p>
                    <p className="text-sm font-bold text-red-600">
                      ₱{item.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        item.date || item.$createdAt
                      ).toLocaleDateString()}
                    </p>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setConfirmMessage(
                            `Are you sure you want to delete expense: ${e.category}?`
                          );
                          setConfirmAction(() => async () => {
                            try {
                              await deleteExpense(e.$id);
                              toast.success("✅ Expense deleted successfully");
                            } catch (err) {
                              console.error(err);
                              toast.error("❌ Failed to delete expense");
                            }
                          });
                          setConfirmOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        show={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
        message={confirmMessage}
      />
    </div>
  );
}
