"use client";
import { useState } from "react";
import { useBayStore } from "../stores/useBayStore";
import toast from "react-hot-toast";

export default function POSBays() {
  const { bays, startTransaction, finishTransaction, toggleReserve } =
    useBayStore();

  const [activeBay, setActiveBay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTender, setShowTender] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    vehicle: "",
    plate: "",
    service: "",
  });
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);
  const servicePrice = 200;

  // --- 🔹 Stats Computation ---
  const totalReserved = bays.filter((b) => b.status === "reserved").length;
  const totalOccupied = bays.filter((b) => b.status === "occupied").length;
  const totalAvailable = bays.filter((b) => b.status === "available").length;
  const totalTransactions = bays.filter((b) => b.customer).length;
  const totalAmount = totalTransactions * servicePrice;

  function handleOpen(bay) {
    setActiveBay(bay);
    document.getElementById("posModal").showModal();
  }

  function closeModal() {
    document.getElementById("posModal").close();
    setActiveBay(null);
    setShowForm(false);
    setShowTender(false);
    setCustomerInfo({ name: "", vehicle: "", plate: "", service: "" });
    setAmountReceived("");
    setChange(0);
  }

  function handleNewTransaction() {
    setShowForm(true);
  }

  function saveCustomerInfo() {
    startTransaction(activeBay.id, customerInfo);
    toast.success(`✅ Transaction started for Bay ${activeBay.id}`, {
      style: {
        background: "#d1fae5", // green-100
        color: "#065f46", // green-800
        fontWeight: "600",
      },
    });
    setActiveBay(null);
    setShowForm(false);
    document.getElementById("posModal").close();
  }

  function handleFinishTransaction() {
    setShowTender(true);
  }

  function confirmFinish() {
    finishTransaction(activeBay.id);
    toast.success(`💰 Transaction finished for Bay ${activeBay.id}`, {
      style: {
        background: "#dbeafe", // blue-100
        color: "#1e3a8a", // blue-900
        fontWeight: "600",
      },
    });
    closeModal();
  }

  function handleReserve() {
    toggleReserve(activeBay.id);
    if (activeBay.status === "reserved") {
      toast(`🔓 Bay ${activeBay.id} unreserved`, {
        icon: "🔓",
        style: {
          background: "#fef3c7", // yellow-100
          color: "#92400e", // yellow-900
          fontWeight: "600",
        },
      });
    } else {
      toast(`⭐ Bay ${activeBay.id} reserved`, {
        icon: "⭐",
        style: {
          background: "#fef3c7", // yellow-100
          color: "#78350f", // yellow-900
          fontWeight: "600",
        },
      });
    }
    closeModal();
  }

  function handleAmountChange(e) {
    const value = e.target.value;
    setAmountReceived(value);
    setChange(value - servicePrice);
  }

  return (
    <div className="p-1 space-y-2">
      <h1 className="text-xl font-bold">POS Bay System</h1>

      {/* 🔹 Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        <div className="p-4 rounded-xl bg-blue-100 text-blue-800 shadow">
          <p className="text-sm opacity-80">Total Transactions</p>
          <p className="text-2xl font-bold">{totalTransactions}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-100 text-green-800 shadow">
          <p className="text-sm opacity-80">Total Sales</p>
          <p className="text-2xl font-bold">₱{totalAmount}</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-100 text-yellow-800 shadow">
          <p className="text-sm opacity-80">Reserved</p>
          <p className="text-2xl font-bold">{totalReserved}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-100 text-red-800 shadow">
          <p className="text-sm opacity-80">Occupied</p>
          <p className="text-2xl font-bold">{totalOccupied}</p>
        </div>
      </div>

      {/* 🔹 Grid of Bays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {bays.map((bay) => (
          <button
            key={bay.id}
            onClick={() => handleOpen(bay)}
            className={`p-6 rounded-2xl shadow text-center cursor-pointer transition transform hover:scale-105 
              ${
                bay.status === "available"
                  ? "bg-green-100 text-green-800"
                  : bay.status === "occupied"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
          >
            <p className="text-lg font-bold">Bay {bay.id}</p>

            {/* Status Badge */}
            <span
              className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium 
                ${
                  bay.status === "available"
                    ? "bg-green-200"
                    : bay.status === "occupied"
                    ? "bg-red-200"
                    : "bg-yellow-200"
                }`}
            >
              {bay.status.charAt(0).toUpperCase() + bay.status.slice(1)}
            </span>

            {bay.customer && (
              <p className="mt-2 text-xs font-medium opacity-90 text-center">
                {bay.customer.name} ({bay.customer.vehicle})
                {bay.status.charAt(0).toUpperCase() + bay.status.slice(1)}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Modal */}
      <dialog id="posModal" className="modal">
        <div className="modal-box max-w-lg rounded-2xl shadow-xl">
          {activeBay && (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">
                  Bay {activeBay.id} –{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  activeBay.status === "available"
                    ? "bg-green-100 text-green-700"
                    : activeBay.status === "occupied"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                  >
                    {activeBay.status.toUpperCase()}
                  </span>
                </h2>
                <button onClick={closeModal} className="btn btn-sm btn-circle">
                  ✕
                </button>
              </div>

              {/* Customer Form */}
              {showForm && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    className="input input-bordered w-full"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Vehicle Type"
                    className="input input-bordered w-full"
                    value={customerInfo.vehicle}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        vehicle: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Plate No."
                    className="input input-bordered w-full"
                    value={customerInfo.plate}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        plate: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Service"
                    className="input input-bordered w-full"
                    value={customerInfo.service}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        service: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={saveCustomerInfo}
                    className="btn btn-success w-full mt-2"
                  >
                    💾 Save Transaction
                  </button>
                </div>
              )}

              {/* Tender Form */}
              {showTender && (
                <div className="space-y-4">
                  <p className="font-semibold text-lg">
                    Total:{" "}
                    <span className="text-purple-600 font-bold">
                      ₱{servicePrice}
                    </span>
                  </p>

                  {/* Select Carwash Boy */}
                  <div>
                    <label className="block font-medium mb-1">
                      Assign Carwash Boy
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={customerInfo.employee || ""}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          employee: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        -- Select Employee --
                      </option>
                      <option value="Juan">Juan</option>
                      <option value="Pedro">Pedro</option>
                      <option value="Maria">Maria</option>
                    </select>
                  </div>

                  {/* Amount Input */}
                  <input
                    type="number"
                    placeholder="Amount Received"
                    className="input input-bordered w-full"
                    value={amountReceived}
                    onChange={handleAmountChange}
                  />

                  {/* Change */}
                  <p className="font-semibold text-lg">
                    Change:{" "}
                    <span
                      className={`font-bold ${
                        change < 0 ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      ₱{change}
                    </span>
                  </p>

                  {/* Company & Employee Share */}
                  <div className="p-3 rounded-lg bg-base-200">
                    <p className="font-medium text-sm">
                      Company Share (70%):{" "}
                      <span className="font-bold text-blue-600">
                        ₱{(servicePrice * 0.7).toFixed(2)}
                      </span>
                    </p>
                    <p className="font-medium text-sm">
                      {customerInfo.employee || "Employee"} Share (30%):{" "}
                      <span className="font-bold text-emerald-600">
                        ₱{(servicePrice * 0.3).toFixed(2)}
                      </span>
                    </p>
                  </div>

                  {/* Confirm Button */}
                  <button
                    disabled={change < 0 || !customerInfo.employee}
                    onClick={confirmFinish}
                    className="btn btn-primary w-full mt-2"
                  >
                    ✅ Confirm & Finish
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {!showForm && !showTender && (
                <div className="space-y-3">
                  {activeBay.status === "available" && (
                    <button
                      onClick={handleNewTransaction}
                      className="btn btn-success w-full"
                    >
                      ➕ New Transaction
                    </button>
                  )}
                  {activeBay.status === "occupied" && (
                    <button
                      onClick={handleFinishTransaction}
                      className="btn btn-error w-full"
                    >
                      ✅ Finish Transaction
                    </button>
                  )}
                  <button
                    onClick={handleReserve}
                    className="btn btn-warning w-full"
                  >
                    {activeBay.status === "reserved"
                      ? "🔓 Unreserve"
                      : "⭐ Reserve"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
