"use client";

import { useState } from "react";
import { databases, ID } from "../../lib/appwrite"; // adjust path if needed

import { useBaysStore } from "../../stores/useBaysStore";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const BAYS_COLLECTION_ID = "bayname"; // change if different

export default function AddBayModal({ onSuccess }) {
  const { fetchBays } = useBaysStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    bayName: "",
    status: "available", // default status
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      setIsOpen(false);
      setForm({ bayName: "", status: "available" });
      if (onSuccess) onSuccess(); // refresh list
      fetchBays();
    } catch (error) {
      console.error("Error adding bay:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        + Add Bay
      </button>

      {/* Modal */}
      {isOpen && (
        <dialog id="addBayModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Bay</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Bay Name */}
              <div className="form-control">
                <label className="label">
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
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Actions */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}
