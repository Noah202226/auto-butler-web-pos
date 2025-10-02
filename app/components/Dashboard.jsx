"use client";
import { useEffect, useState } from "react";
import { useBayStore } from "../stores/useBayStore";
import toast from "react-hot-toast";
import ServiceSelect from "./Helpers/ServiceSelect";

export default function POSBays() {
  const {
    bays,
    fetchBays,
    startTransaction,
    finishTransaction,
    toggleReserve,
  } = useBayStore();

  useEffect(() => {
    fetchBays();
  }, [fetchBays]);

  const [activeBay, setActiveBay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTender, setShowTender] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    vehicle: "",
    plate: "",
    service: "",
    servicePrice: 0,
    employee: "",
  });
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);

  // --- 🔹 Stats Computation ---
  const totalReserved = bays.filter((b) => b.status === "reserved").length;
  const totalOccupied = bays.filter((b) => b.status === "occupied").length;
  const totalAvailable = bays.filter((b) => b.status === "available").length;
  const totalTransactions = bays.filter((b) => b.customerName).length;
  const totalAmount = totalTransactions * customerInfo?.servicePrice;

  function handleOpen(bay) {
    setActiveBay(bay);
    document.getElementById("posModal").showModal();
  }

  function closeModal() {
    document.getElementById("posModal").close();
    setActiveBay(null);
    setShowForm(false);
    setShowTender(false);
    setCustomerInfo({
      name: "",
      vehicle: "",
      plate: "",
      service: "",
      servicePrice: 0,
      employee: "",
    });
    setAmountReceived("");
    setChange(0);
  }

  function handleNewTransaction() {
    setShowForm(true);
  }

  async function saveCustomerInfo() {
    await startTransaction(activeBay.docId, {
      name: customerInfo.name,
      plateNumber: customerInfo.plate,
      vehicle: customerInfo.vehicle,
      service: customerInfo.service,
      servicePrice: customerInfo.servicePrice,
    });

    toast.success(`✅ Transaction started for Bay ${activeBay.bayName}`);
    closeModal();
  }

  function handleFinishTransaction() {
    setShowTender(true);
  }

  async function confirmFinish() {
    const companyShare = customerInfo.servicePrice * 0.7;
    const employeeShare = customerInfo.servicePrice * 0.3;

    await finishTransaction(activeBay.docId, {
      employeeId: customerInfo.$id,
      employeeName: customerInfo.employee,
      amountReceived: Number(amountReceived),
      change: Number(change),
      companyShare,
      employeeShare,
      paymentMethod: "cash", // you can extend this to select method
    });

    toast.success(`💰 Transaction finished for Bay ${activeBay.bayName}`);
    closeModal();
  }

  async function handleReserve() {
    await toggleReserve(activeBay.docId);

    if (activeBay.status === "reserved") {
      toast(`🔓 Bay ${activeBay.bayName} unreserved`, { icon: "🔓" });
    } else {
      toast(`⭐ Bay ${activeBay.bayName} reserved`, { icon: "⭐" });
    }
    closeModal();
  }

  function handleAmountChange(e) {
    const value = e.target.value;
    setAmountReceived(value);
    setChange(value - customerInfo.servicePrice);
  }

  return (
    <div className="p-1 space-y-2">
      {/* 🔹 Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {/* <div className="p-4 rounded-xl bg-blue-100 text-blue-800 shadow">
          <p className="text-sm opacity-80">Total Transactions</p>
          <p className="text-2xl font-bold">{totalTransactions}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-100 text-green-800 shadow">
          <p className="text-sm opacity-80">Total Sales</p>
          <p className="text-2xl font-bold">₱{totalAmount}</p>
        </div> */}
        <div className="p-4 rounded-xl bg-yellow-100 text-yellow-800 shadow">
          <p className="text-sm opacity-80">Available</p>
          <p className="text-2xl font-bold">{totalAvailable}</p>
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
      <h1 className="text-xl font-bold">Your Bays</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-2">
        {bays.map((bay) => (
          <button
            key={bay.$id}
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
            <p className="text-lg font-bold">{bay.bayName}</p>
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
            {bay.customerName && (
              <p className="mt-2 text-xs font-medium opacity-90 text-center">
                {bay.customerName} ({bay.customerPlateNumber})
              </p>
            )}
          </button>
        ))}
      </div>

      {/* 🔹 Modal */}
      <dialog id="posModal" className="modal">
        <div className="modal-box max-w-lg rounded-2xl shadow-xl">
          {activeBay && (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">{activeBay.bayName}</h2>
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
                    placeholder="Vehicle"
                    className="input input-bordered w-full"
                    value={customerInfo.vehicle}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        vehicle: e.target.value,
                      })
                    }
                  />

                  <ServiceSelect
                    customerInfo={customerInfo}
                    setCustomerInfo={setCustomerInfo}
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
                    Total: ₱{customerInfo.servicePrice}
                  </p>

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

                  <input
                    type="number"
                    placeholder="Amount Received"
                    className="input input-bordered w-full"
                    value={amountReceived}
                    onChange={handleAmountChange}
                  />

                  <p className="font-semibold text-lg">
                    Change: ₱
                    <span
                      className={`font-bold ${
                        change < 0 ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {change}
                    </span>
                  </p>

                  <div className="p-3 rounded-lg bg-base-200">
                    <p>
                      Company Share (70%): ₱
                      {(customerInfo.servicePrice * 0.7).toFixed(2)}
                    </p>
                    <p>
                      {customerInfo.employee || "Employee"} Share (30%): ₱
                      {(customerInfo.servicePrice * 0.3).toFixed(2)}
                    </p>
                  </div>

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
