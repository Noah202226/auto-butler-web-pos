"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useProductStore } from "../../stores/useProductStore";
import { useBaysStore } from "../../stores/useBaysStore";
import { useServiceStore } from "../../stores/useServiceStore";
import { useEmployeeStore } from "../../stores/useEmployeeStore";
import AddProductModal from "../Helpers/AddProductModal";
import AddBayModal from "../Helpers/AddBayModal";
import EmployeeList from "./EmployeeList";
import AddEmployeeModal from "../Helpers/AddEmployeeModal";
import AddServiceModal from "../Helpers/AddServiceModal";
import { databases } from "@/app/lib/appwrite";

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("personalization");

  const {
    loading,
    businessName,
    setBusinessName,
    initial,
    setInitial,
    fetchSettings,
    saveSettings,
  } = useSettingsStore();

  const { products, fetchProducts, removeProduct } = useProductStore();
  const { bays, fetchBays, removeBay } = useBaysStore();
  const { services, fetchServices } = useServiceStore();
  const { fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchSettings();
    fetchProducts();
    fetchBays();
    fetchServices();
    fetchEmployees();
  }, []);

  const handleSave = async () => {
    try {
      await saveSettings();
      toast.success("✅ Settings updated successfully");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="bg-base-100 text-base-content rounded-2xl shadow-lg border border-base-300 p-3 sm:p-4 animate-fade-up">
      <h2 className="text-2xl font-bold text-base-content mb-6">Settings</h2>

      {/* Tabs */}
      {/* Tabs */}
      <div className="border-b pb-2 mb-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex gap-6 text-sm font-medium text-gray-500">
          {["personalization", "products", "bays", "employees", "services"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize transition-all pb-2 px-1 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-500"
                    : "hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Mobile Dropdown */}
        <div className="sm:hidden relative w-full">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {[
              "personalization",
              "products",
              "bays",
              "employees",
              "services",
            ].map((tab) => (
              <option key={tab} value={tab}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div
        key={activeTab}
        className="transition-all duration-300 ease-out animate-fade-up"
      >
        {/* PERSONALIZATION */}
        {activeTab === "personalization" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-base-content">
              General Settings
            </h2>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Company Name
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Initial
              </label>
              <input
                type="text"
                maxLength={2}
                className="input input-bordered w-24 text-center font-bold text-lg"
                placeholder="A"
                value={initial}
                onChange={(e) => setInitial(e.target.value.toUpperCase())}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-base-content">
                Products
              </h3>
              <AddProductModal />
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Value</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p) => (
                      <tr
                        key={p.$id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{p.productName}</td>
                        <td className="px-4 py-2">{p.category}</td>
                        <td className="px-4 py-2">₱{p.price}</td>
                        <td className="px-4 py-2">{p.stockQuantity}</td>
                        <td className="px-4 py-2">
                          ₱{p.price * p.stockQuantity}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => removeProduct(p.$id)}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-gray-400 py-4"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden flex flex-col gap-3">
              {products.map((p) => (
                <div
                  key={p.$id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-base-content">
                      {p.productName}
                    </p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                    <p className="text-sm text-gray-600">
                      ₱{p.price} × {p.stockQuantity} ={" "}
                      <span className="font-medium">
                        ₱{p.price * p.stockQuantity}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeProduct(p.$id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BAYS */}
        {activeTab === "bays" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-base-content">Bays</h3>
              <AddBayModal />
            </div>

            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Bay Name</th>
                    <th className="px-4 py-2 text-left">Created</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bays.map((b) => (
                    <tr
                      key={b.$id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">{b.bayName}</td>
                      <td className="px-4 py-2">
                        {new Date(b.$createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => removeBay(b.$id)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="sm:hidden flex flex-col gap-3">
              {bays.map((b) => (
                <div
                  key={b.$id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-base-content">
                      {b.bayName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(b.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeBay(b.$id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-base-content">
                Services
              </h3>
              <AddServiceModal />
            </div>
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Service Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                    services.map((s) => (
                      <tr
                        key={s.$id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{s.serviceName}</td>
                        <td className="px-4 py-2">₱{s.servicePrice}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={async () => {
                              if (confirm(`Delete "${s.serviceName}"?`)) {
                                try {
                                  await databases.deleteDocument(
                                    process.env.NEXT_PUBLIC_DATABASE_ID,
                                    "services",
                                    s.$id
                                  );
                                  toast.success("🗑️ Deleted successfully");
                                  fetchServices();
                                } catch (error) {
                                  console.error(
                                    "Error deleting service:",
                                    error
                                  );
                                  toast.error("Failed to delete service");
                                }
                              }
                            }}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-gray-400 py-4"
                      >
                        No services yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMPLOYEES */}
        {activeTab === "employees" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-base-content">
                Employees
              </h3>
              <AddEmployeeModal />
            </div>
            <EmployeeList />
          </div>
        )}
      </div>
    </div>
  );
}
