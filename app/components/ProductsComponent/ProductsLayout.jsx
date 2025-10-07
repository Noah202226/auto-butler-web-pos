"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import AddProductModal from "../Helpers/AddProductModal";
import { Trash2, Package } from "lucide-react";

export default function Products() {
  const { products, fetchProducts, removeProduct } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setDeleting(true);
    await removeProduct(selectedProduct.$id);
    setDeleting(false);
    setSelectedProduct(null);
    window.confirm_delete_modal.close();
  };

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-base-content">
          <Package size={22} className="text-primary" /> Products
        </h2>
        <AddProductModal />
      </div>

      {/* Product Cards */}
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.$id}
              className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="card-body">
                <h3 className="card-title text-lg font-semibold text-base-content">
                  {p.productName}
                </h3>
                <p className="text-sm opacity-70">{p.category}</p>

                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-base-content/80">
                      Price:
                    </span>{" "}
                    ₱{p.price}
                  </p>
                  <p>
                    <span className="font-medium text-base-content/80">
                      Stock:
                    </span>{" "}
                    {p.stockQuantity}
                  </p>
                  <p>
                    <span className="font-medium text-base-content/80">
                      Supplier:
                    </span>{" "}
                    {p.supplierName}
                  </p>
                  <p className="italic opacity-70">{p.description}</p>
                </div>

                <p className="text-xs opacity-50 mt-2">
                  Added on{" "}
                  {new Date(p.$createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      window.confirm_delete_modal.showModal();
                    }}
                    className="btn btn-error btn-sm flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 opacity-70">
          <Package size={50} className="text-primary mb-3" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm opacity-60">
            Start adding your first product to get started.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <dialog id="confirm_delete_modal" className="modal">
        <div className="modal-box bg-base-100 text-base-content">
          <h3 className="font-bold text-lg text-error flex items-center gap-2">
            <Trash2 size={18} /> Confirm Deletion
          </h3>
          <p className="py-3">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedProduct?.productName}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost">Cancel</button>
              <button
                onClick={handleDelete}
                className={`btn btn-error ${deleting ? "loading" : ""}`}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
