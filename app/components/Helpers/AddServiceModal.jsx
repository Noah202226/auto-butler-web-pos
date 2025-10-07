"use client";

import { useState } from "react";
import { databases, ID } from "../../lib/appwrite";
import { useServiceStore } from "../../stores/useServiceStore";
import toast from "react-hot-toast";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const BAYS_COLLECTION_ID = "services"; // change if different

export default function AddServiceModal({ onSuccess }) {
  const { fetchServices } = useServiceStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    serviceName: "",
    servicePrice: parseInt(0),
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert price to integer before saving
      const payload = {
        serviceName: form.serviceName.trim(),
        servicePrice: parseInt(form.servicePrice),
      };

      await databases.createDocument(
        DATABASE_ID,
        BAYS_COLLECTION_ID,
        ID.unique(),
        payload
      );

      // ✅ show success toast
      toast.success("✅ Added successfully");

      // ✅ close modal & reset
      const modal = document.getElementById("addServiceModal");
      modal?.close();
      setForm({ serviceName: "", servicePrice: 0 });

      // refresh list
      fetchServices();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding bay:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Open modal button */}
      <button
        className="btn btn-primary btn-sm"
        onClick={() => document.getElementById("addServiceModal").showModal()}
      >
        + Add Bay
      </button>

      {/* Modal */}
      <dialog id="addServiceModal" className="modal">
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
          <h3 className="font-bold text-lg mb-4 text-black">Add New Bay</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Bay Name */}
            <div className="form-control">
              <label className="label text-black">
                <span className="label-text">Service Name</span>
              </label>
              <input
                type="text"
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                placeholder="Enter Service Name"
              />
            </div>

            {/* Price */}
            <div className="form-control">
              <label className="label text-black">
                <span className="label-text">Price</span>
              </label>
              <input
                type="number"
                name="servicePrice"
                value={form.servicePrice}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                placeholder="Price"
              />
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("addServiceModal").close()
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-black"
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
