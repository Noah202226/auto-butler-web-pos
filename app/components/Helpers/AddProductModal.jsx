"use client";

import { useState } from "react";
import { databases, ID } from "../../lib/appwrite"; // adjust path if different
import toast from "react-hot-toast";
import { useProductStore } from "@/app/stores/useProductStore";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = "products"; // update if you used another ID

export default function AddProductModal({ onSuccess }) {
  const { fetchProducts } = useProductStore();

  const [form, setForm] = useState({
    productId: "",
    productName: "",
    category: "",
    price: "",
    stockQuantity: "",
    supplierName: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await databases.createDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        ID.unique(),
        {
          productId: parseInt(form.productId),
          productName: form.productName,
          category: form.category,
          price: parseFloat(form.price),
          stockQuantity: parseInt(form.stockQuantity, 10),
          supplierName: form.supplierName,
          description: form.description,
        }
      );

      if (onSuccess) {
        onSuccess();
      }

      // reset form
      setForm({
        productId: "",
        productName: "",
        category: "",
        price: "",
        stockQuantity: "",
        supplierName: "",
        description: "",
      });

      document.getElementById("add_product_modal").close();
      toast.success("New Product added");
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Open Modal Button */}
      <button
        className="btn btn-primary"
        onClick={() => document.getElementById("add_product_modal").showModal()}
      >
        + Add Product
      </button>

      {/* Modal */}
      <dialog id="add_product_modal" className="modal">
        <div className="modal-box max-w-lg">
          <h3 className="font-bold text-lg mb-4">Add New Product</h3>

          <div className="space-y-3">
            <input
              type="number"
              name="productId"
              placeholder="Product ID"
              className="input input-bordered w-full"
              value={form.productId}
              onChange={handleChange}
            />
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              className="input input-bordered w-full"
              value={form.productName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="input input-bordered w-full"
              value={form.category}
              onChange={handleChange}
            />
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="Price (₱)"
              className="input input-bordered w-full"
              value={form.price}
              onChange={handleChange}
            />
            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock Quantity"
              className="input input-bordered w-full"
              value={form.stockQuantity}
              onChange={handleChange}
            />
            <input
              type="text"
              name="supplierName"
              placeholder="Supplier Name"
              className="input input-bordered w-full"
              value={form.supplierName}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() =>
                document.getElementById("add_product_modal").close()
              }
            >
              Cancel
            </button>
            <button
              className={`btn btn-success ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
