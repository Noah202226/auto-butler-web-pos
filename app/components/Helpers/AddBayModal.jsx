"use client";

import { useState } from "react";
import { databases, ID } from "../../lib/appwrite";
import { useBaysStore } from "../../stores/useBaysStore";
import toast from "react-hot-toast";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const BAYS_COLLECTION_ID = "bayname"; // change if different

export default function AddBayModal({ onSuccess }) {
  const { fetchBays } = useBaysStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bayName: "",
    status: "available",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await databases.createDocument(
        DATABASE_ID,
        BAYS_COLLECTION_ID,
        ID.unique(),
        form
      );

      // ✅ show success toast
      toast.success("✅ Added successfully");

      // ✅ close modal & reset
      const modal = document.getElementById("addBayModal");
      modal?.close();
      setForm({ bayName: "", status: "available" });

      // refresh list
      fetchBays();
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
        onClick={() => document.getElementById("addBayModal").showModal()}
      >
        + Add Bay
      </button>

      {/* Modal */}
      <dialog id="addBayModal" className="modal">
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
                <span className="label-text">Bay Name</span>
              </label>
              <input
                type="text"
                name="bayName"
                value={form.bayName}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
                placeholder="Enter bay name"
              />
            </div>

            {/* Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("addBayModal").close()}
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
