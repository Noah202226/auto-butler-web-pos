"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useProductStore } from "../../stores/useProductStore";
import { useBaysStore } from "../../stores/useBaysStore";
import AddProductModal from "../Helpers/AddProductModal";
import AddBayModal from "../Helpers/AddBayModal";
import { useServiceStore } from "@/app/stores/useServiceStore";
import { useEmployeeStore } from "@/app/stores/useEmployeeStore";

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("personalization");

  // --- Settings Store (personalization)
  const {
    businessName,
    themeColor,
    logo,
    setBusinessName,
    setThemeColor,
    setLogo,
    fetchSettings,
    saveSettings,
  } = useSettingsStore();

  // --- Products Store
  const { products, fetchProducts, addProduct, removeProduct } =
    useProductStore();

  // --- Bays Store
  const { bays, fetchBays, addBay, removeBay } = useBaysStore();

  // --- Services Store
  const { services, fetchServices } = useServiceStore();

  // --- Employee Store
  const { employees, fetchEmployees } = useEmployeeStore();

  // Load data on mount
  useEffect(() => {
    fetchSettings();
    fetchProducts();
    fetchBays();
    fetchServices();
    fetchEmployees();
  }, []);

  // handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Settings</h2>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 border-b mb-6 min-w-max whitespace-nowrap">
          {["personalization", "products", "bays", "employees", "services"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-4 font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Personalization */}
        {activeTab === "personalization" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              App Personalization
            </h3>

            {/* Business Name */}
            <div>
              <label className="block text-sm text-gray-600 font-medium">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter business name"
                className="mt-1 w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>

            {/* Theme Color */}
            {/* <div>
              <label className="block text-sm text-gray-600 font-medium">
                Theme Color
              </label>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="mt-1 h-10 w-20 border rounded cursor-pointer"
              />
            </div> */}

            {/* Logo Upload */}
            {/* <div>
              <label className="block text-sm text-gray-600 font-medium">
                Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="mt-1 block text-sm text-gray-600"
              />
              {logo && (
                <img
                  src={logo}
                  alt="Logo preview"
                  className="mt-2 h-16 object-contain"
                />
              )}
            </div> */}

            <button
              onClick={saveSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow text-sm"
            >
              💾 Save Settings
            </button>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Products</h3>
            <p className="text-gray-500 text-sm">
              Configure services and products offered in your shop.
            </p>

            <AddProductModal />

            {/* Product table */}
            <div className="mt-4 border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>

                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock/s</th>
                    <th className="px-4 py-2 text-left">Total Value</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p) => (
                      <tr key={p.$id} className="border-t">
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
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
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
                        className="text-center text-gray-500 py-4"
                      >
                        No products yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bays */}
        {activeTab === "bays" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Bays</h3>
            <p className="text-gray-500 text-sm">
              Configure and manage your available service bays.
            </p>

            <AddBayModal />

            {/* Bay list */}
            <div className="mt-4 border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Bay Name</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bays.length > 0 ? (
                    bays.map((b) => (
                      <tr key={b.$id} className="border-t">
                        <td className="px-4 py-2">{b.bayName}</td>
                        <td className="px-4 py-2">
                          {new Date(b.$createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => removeBay(b.$id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center text-gray-500 py-4"
                      >
                        No bays configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Services</h3>
            <p className="text-gray-500 text-sm">
              Configure and manage your available services.
            </p>

            {/* <AddBayModal /> */}

            {/* Bay list */}
            <div className="mt-4 border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Services Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                    services.map((b) => (
                      <tr key={b.$id} className="border-t">
                        <td className="px-4 py-2">{b.serviceName}</td>
                        <td className="px-4 py-2">{b.servicePrice}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => removeBay(b.$id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center text-gray-500 py-4"
                      >
                        No Services configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Employees</h3>
            <p className="text-gray-500 text-sm">
              Configure and manage your employees.
            </p>

            {/* <AddBayModal /> */}

            {/* Bay list */}
            <div className="mt-4 border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Employee Name</th>
                    <th className="px-4 py-2 text-left">Date hired</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((b) => (
                      <tr key={b.$id} className="border-t">
                        <td className="px-4 py-2">{b.name}</td>
                        <td className="px-4 py-2">
                          {new Date(b.$createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => removeBay(b.$id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center text-gray-500 py-4"
                      >
                        No Services configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
