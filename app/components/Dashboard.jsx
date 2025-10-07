"use client";
import { useEffect, useState } from "react";
import { useBayStore } from "../stores/useBayStore";
import toast from "react-hot-toast";
import ServiceSelect from "./Helpers/ServiceSelect";
import EmployeeSelect from "./Helpers/EmployeeSelect";

export default function POSBays() {
  const {
    bays,
    fetchBays,
    startTransaction,
    finishTransaction,
    toggleReserve,
    addBay, // ✅ Make sure you have this function in your store
  } = useBayStore();

  const [activeBay, setActiveBay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTender, setShowTender] = useState(false);
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);
  const [addingBay, setAddingBay] = useState(false); // ✅ state for adding new bay

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    vehicle: "",
    plate: "",
    service: "",
    servicePrice: 0,
    employee: "",
  });

  useEffect(() => {
    fetchBays();
  }, [fetchBays]);

  const totalReserved = bays.filter((b) => b.status === "reserved").length;
  const totalOccupied = bays.filter((b) => b.status === "occupied").length;
  const totalAvailable = bays.filter((b) => b.status === "available").length;

  async function handleOpen(bay) {
    setActiveBay(bay);
    if (bay.status === "occupied") {
      const activeTx = await useBayStore
        .getState()
        .getActiveTransaction(bay.docId);
      if (activeTx) {
        setCustomerInfo({
          name: activeTx.customerName,
          vehicle: activeTx.vehicle,
          plate: activeTx.plateNumber,
          service: activeTx.service,
          servicePrice: activeTx.servicePrice,
          employee: activeTx.employeeName || "",
        });
      }
    } else {
      setCustomerInfo({
        name: "",
        vehicle: "",
        plate: "",
        service: "",
        servicePrice: 0,
        employee: "",
      });
    }
    document.getElementById("posModal").showModal();
  }

  function closeModal() {
    document.getElementById("posModal").close();
    setActiveBay(null);
    setShowForm(false);
    setShowTender(false);
    setAmountReceived("");
    setChange(0);
  }

  async function saveCustomerInfo() {
    try {
      setSaving(true);
      await startTransaction(activeBay.docId, {
        name: customerInfo.name,
        plateNumber: customerInfo.plate,
        vehicle: customerInfo.vehicle,
        service: customerInfo.serviceName,
        servicePrice: customerInfo.servicePrice,
        employeeName: customerInfo.employee,
      });
      toast.success(`🚗 Transaction started for ${activeBay.bayName}`);
      closeModal();
    } catch {
      toast.error("❌ Failed to save transaction");
    } finally {
      setSaving(false);
    }
  }

  async function confirmFinish() {
    try {
      setFinishing(true);
      const companyShare = customerInfo.servicePrice * 0.7;
      const employeeShare = customerInfo.servicePrice * 0.3;
      await finishTransaction(activeBay.docId, {
        amountReceived: Number(amountReceived),
        change: Number(change),
        companyShare,
        employeeShare,
        paymentMethod: "cash",
      });
      toast.success(`💰 Bay ${activeBay.bayName} transaction finished`);
      closeModal();
    } catch {
      toast.error("❌ Failed to finish transaction");
    } finally {
      setFinishing(false);
    }
  }

  async function handleReserve() {
    try {
      setReserving(true);
      await toggleReserve(activeBay.docId);
      toast.success(
        activeBay.status === "reserved"
          ? `🔓 Bay ${activeBay.bayName} unreserved`
          : `⭐ Bay ${activeBay.bayName} reserved`
      );
      closeModal();
    } catch {
      toast.error("❌ Failed to update reservation");
    } finally {
      setReserving(false);
    }
  }

  function handleAmountChange(e) {
    const value = e.target.value;
    setAmountReceived(value);
    setChange(value - customerInfo.servicePrice);
  }

  async function handleAddBay() {
    const name = prompt("Enter new Bay name:");
    if (!name) return;
    try {
      setAddingBay(true);
      await addBay(name);
      toast.success(`✅ Bay "${name}" added successfully!`);
    } catch {
      toast.error("❌ Failed to add bay");
    } finally {
      setAddingBay(false);
    }
  }

  return (
    <div className="p-4">
      {/* 🔹 Dashboard Header */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="stat bg-success text-success-content rounded-2xl">
          <div className="stat-title">Available Bays</div>
          <div className="stat-value">{totalAvailable}</div>
        </div>
        <div className="stat bg-warning text-warning-content rounded-2xl">
          <div className="stat-title">Reserved</div>
          <div className="stat-value">{totalReserved}</div>
        </div>
        <div className="stat bg-error text-error-content rounded-2xl">
          <div className="stat-title">Occupied</div>
          <div className="stat-value">{totalOccupied}</div>
        </div>
      </div>

      {/* 🔹 Bay Grid or Empty State */}
      <h1 className="text-xl font-bold mb-3">Active Bays</h1>
      {bays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-base-200 rounded-2xl border border-dashed">
          <p className="text-lg opacity-70 mb-4 text-center">
            🚫 No Bays Found. <br />
            Add a new bay in the settings section to get started.
          </p>
          {/* <button
            onClick={handleAddBay}
            disabled={addingBay}
            className="btn btn-primary"
          >
            {addingBay ? "⏳ Adding..." : "➕ Add New Bay"}
          </button> */}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {bays.map((bay) => (
            <div
              key={bay.$id}
              onClick={() => handleOpen(bay)}
              className={`p-6 rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl border
                ${
                  bay.status === "available"
                    ? "bg-success/10 border-success text-success"
                    : bay.status === "occupied"
                    ? "bg-error/10 border-error text-error"
                    : "bg-warning/10 border-warning text-warning"
                }`}
            >
              <h2 className="text-lg font-bold">{bay.bayName}</h2>
              <p className="text-sm opacity-70 mt-1 capitalize">{bay.status}</p>
              {bay.customerName && (
                <p className="mt-2 text-sm">
                  {bay.customerName} ({bay.customerPlateNumber})
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Modern Modal */}
      <dialog id="posModal" className="modal">
        <div className="modal-box max-w-md bg-base-100 rounded-2xl">
          {activeBay && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {activeBay.bayName}{" "}
                  <span className="text-sm font-normal opacity-60">
                    ({activeBay.status})
                  </span>
                </h3>
                <button onClick={closeModal} className="btn btn-sm btn-circle">
                  ✕
                </button>
              </div>

              {/* Transaction and Tender UI */}
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
                    placeholder="Plate Number"
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

                  <ServiceSelect
                    customerInfo={customerInfo}
                    setCustomerInfo={setCustomerInfo}
                  />
                  <EmployeeSelect
                    customerInfo={customerInfo}
                    setCustomerInfo={setCustomerInfo}
                  />

                  <button
                    onClick={saveCustomerInfo}
                    disabled={saving}
                    className="btn btn-success w-full mt-2"
                  >
                    {saving ? "💾 Saving..." : "💾 Start Transaction"}
                  </button>
                </div>
              )}

              {showTender && (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      Total: ₱{customerInfo.servicePrice.toFixed(2)}
                    </p>
                  </div>

                  <input
                    type="number"
                    placeholder="Amount Received"
                    className="input input-bordered w-full"
                    value={amountReceived}
                    onChange={handleAmountChange}
                  />
                  <p className="text-lg font-bold">
                    Change:{" "}
                    <span
                      className={`${
                        change < 0 ? "text-error" : "text-success"
                      }`}
                    >
                      ₱{change.toFixed(2)}
                    </span>
                  </p>

                  <div className="p-3 bg-base-200 rounded-xl text-sm">
                    <p>
                      Company Share: ₱
                      {(customerInfo.servicePrice * 0.7).toFixed(2)}
                    </p>
                    <p>
                      Employee Share: ₱
                      {(customerInfo.servicePrice * 0.3).toFixed(2)}
                    </p>
                  </div>

                  <button
                    disabled={change < 0}
                    onClick={confirmFinish}
                    className="btn btn-primary w-full"
                  >
                    {finishing ? "⏳ Finishing..." : "✅ Confirm & Finish"}
                  </button>
                </div>
              )}

              {!showForm && !showTender && (
                <div className="flex flex-col gap-3">
                  {activeBay.status === "available" && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn btn-success w-full"
                    >
                      ➕ Start Transaction
                    </button>
                  )}
                  {activeBay.status === "occupied" && (
                    <button
                      onClick={() => setShowTender(true)}
                      className="btn btn-error w-full"
                    >
                      ✅ Finish Transaction
                    </button>
                  )}
                  <button
                    onClick={handleReserve}
                    disabled={reserving}
                    className="btn btn-warning w-full"
                  >
                    {reserving
                      ? "⏳ Updating..."
                      : activeBay.status === "reserved"
                      ? "🔓 Unreserve Bay"
                      : "⭐ Reserve Bay"}
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
