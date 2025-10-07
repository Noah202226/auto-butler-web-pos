"use client";
import { useState } from "react";
import { useProductStore } from "../../stores/useProductStore";

export default function UseProductModal() {
  const { products, useProduct } = useProductStore();
  const [form, setForm] = useState({ productId: "", quantityUsed: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await useProduct(form.productId, Number(form.quantityUsed));
    setLoading(false);
    document.getElementById("useProductModal").close();
    setForm({ productId: "", quantityUsed: "" });
  };

  return (
    <>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => document.getElementById("useProductModal").showModal()}
      >
        Use Product
      </button>

      <dialog id="useProductModal" className="modal">
        <div className="modal-box bg-white rounded-xl shadow-lg transition-all duration-300 ease-out opacity-0 translate-y-2 animate-[fadeInUp_0.3s_ease-out_forwards]">
          <h3 className="font-bold text-lg mb-4">Use Product</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              name="productId"
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.$id} value={p.$id}>
                  {p.productName} ({p.stockQuantity} in stock)
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantityUsed"
              value={form.quantityUsed}
              onChange={(e) =>
                setForm({ ...form, quantityUsed: e.target.value })
              }
              placeholder="Quantity to use"
              required
              className="input input-bordered w-full"
            />

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("useProductModal").close()
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
