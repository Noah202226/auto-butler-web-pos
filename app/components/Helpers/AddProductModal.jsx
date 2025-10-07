"use client";

import { useState } from "react";
import { useProductStore } from "../../stores/useProductStore";

export default function AddProductModal() {
  const { addProduct } = useProductStore();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    category: "",
    price: "",
    stockQuantity: "",
    supplierName: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addProduct({
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    });

    setForm({
      productName: "",
      category: "",
      price: "",
      stockQuantity: "",
      supplierName: "",
      description: "",
    });
    setIsOpen(false);
  };

  return (
    <>
      {/* Open Button */}
      <button className="btn btn-primary mb-4" onClick={() => setIsOpen(true)}>
        ➕ Add Product
      </button>

      {/* Modal */}
      {isOpen && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Add New Product</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                className="input input-bordered w-full"
                value={form.productName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                className="input input-bordered w-full"
                value={form.category}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                className="input input-bordered w-full"
                value={form.price}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="stockQuantity"
                placeholder="Stock Quantity"
                className="input input-bordered w-full"
                value={form.stockQuantity}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="supplierName"
                placeholder="Supplier Name"
                className="input input-bordered w-full col-span-2"
                value={form.supplierName}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Description"
                className="textarea textarea-bordered w-full col-span-2"
                value={form.description}
                onChange={handleChange}
              ></textarea>

              <div className="modal-action col-span-2">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}
