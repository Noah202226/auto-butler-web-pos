"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import AddProductModal from "../Helpers/AddProductModal";

export default function Products() {
  const { products, fetchProducts, addProduct, removeProduct } =
    useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    category: "",
    price: "",
    stockQuantity: "",
    supplierName: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(
      form.productName,
      form.price,
      form.category,
      form.stockQuantity,
      form.supplierName,
      form.description
    );
    setForm({
      productName: "",
      category: "",
      price: "",
      stockQuantity: "",
      supplierName: "",
      description: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-xl font-semibold flex flex-1 items-center gap-2 ">
          🛒 Products
        </h2>
        <AddProductModal />
      </div>

      {/* Product Cards Grid */}
      {products.length > 0 ? (
        <div className="grid md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.$id}
              className="card bg-base-200 shadow-xl border border-gray-700"
            >
              <div className="card-body">
                <h3 className="card-title">{p.productName}</h3>
                <p className="text-sm text-gray-400">{p.category}</p>
                <p className="mt-2">Price: ₱{p.price}</p>
                <p>Stock: {p.stockQuantity}</p>
                <p>Supplier: {p.supplierName}</p>
                <p className="text-sm italic">{p.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(p.$createdAt).toLocaleDateString()}
                </p>
                <div className="card-actions justify-end mt-3">
                  <button
                    onClick={() => removeProduct(p.$id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
