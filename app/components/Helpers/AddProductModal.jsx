"use client";

import { useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import toast from "react-hot-toast";

export default function AddProductModal() {
  const { addProduct } = useProductStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    productName: "",
    category: "",
    price: "",
    stockQuantity: "",
    supplierName: "",
    description: "",
  });

  const categories = [
    "Exterior Wash",
    "Interior Detailing",
    "Full Service",
    "Engine Cleaning",
    "Wax & Polish",
    "Tire & Rim Care",
    "Others",
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.productName ||
      !form.category ||
      !form.price ||
      !form.stockQuantity
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      setLoading(true);

      await addProduct({
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      });

      toast.success("✅ Product added successfully!");

      // ✅ Reset and close
      setForm({
        productName: "",
        category: "",
        price: "",
        stockQuantity: "",
        supplierName: "",
        description: "",
      });

      document.getElementById("addProductModal")?.close();
    } catch (error) {
      console.error("Add Product Error:", error);
      toast.error("❌ Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Open Modal Button */}
      <button
        className="btn btn-primary btn-sm"
        onClick={() => document.getElementById("addProductModal").showModal()}
      >
        + Add Product
      </button>

      {/* Modal */}
      <dialog id="addProductModal" className="modal">
        <div
          className="
            modal-box 
            bg-white 
            rounded-xl 
            shadow-lg 
            transform 
            transition-all 
            duration-300 
            ease-out 
            opacity-0 
            translate-y-3 
            animate-[fadeInUp_0.3s_ease-out_forwards]
          "
        >
          <h3 className="font-bold text-lg mb-4 text-black">Add New Product</h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              className="input input-bordered w-full col-span-2 sm:col-span-1"
              value={form.productName}
              onChange={handleChange}
              required
            />

            {/* Category Dropdown */}
            <select
              name="category"
              className="select select-bordered w-full col-span-2 sm:col-span-1"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Price */}
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="input input-bordered w-full col-span-2 sm:col-span-1"
              value={form.price}
              onChange={handleChange}
              required
            />

            {/* Stock Quantity */}
            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock Quantity"
              className="input input-bordered w-full col-span-2 sm:col-span-1"
              value={form.stockQuantity}
              onChange={handleChange}
              required
            />

            {/* Supplier Name */}
            <input
              type="text"
              name="supplierName"
              placeholder="Supplier Name"
              className="input input-bordered w-full col-span-2"
              value={form.supplierName}
              onChange={handleChange}
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Description"
              className="textarea textarea-bordered w-full col-span-2"
              value={form.description}
              onChange={handleChange}
            ></textarea>

            {/* Actions */}
            <div className="modal-action col-span-2">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("addProductModal").close()
                }
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary text-black ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
