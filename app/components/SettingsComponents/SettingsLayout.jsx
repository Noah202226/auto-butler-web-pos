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
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mt-6 animate-fade-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-6 border-b pb-2 mb-6 text-sm font-medium text-gray-500">
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

      {/* Content */}
      <div
        key={activeTab}
        className="transition-all duration-300 ease-out animate-fade-up"
      >
        {/* PERSONALIZATION */}
        {activeTab === "personalization" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              General Settings
            </h2>

            {/* Company Name */}
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

            {/* Initial */}
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

            {/* Save Button */}
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
              <h3 className="text-lg font-semibold text-gray-800">Products</h3>
              <AddProductModal />
            </div>
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
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
          </div>
        )}

        {/* BAYS */}
        {activeTab === "bays" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Bays</h3>
              <AddBayModal />
            </div>
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Bay Name</th>
                    <th className="px-4 py-2 text-left">Created</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bays.length > 0 ? (
                    bays.map((b) => (
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
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-gray-400 py-4"
                      >
                        No bays yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Services</h3>
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Service Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
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
            <h3 className="text-lg font-semibold text-gray-800">Employees</h3>
            <EmployeeList />
          </div>
        )}
      </div>
    </div>
  );
}
