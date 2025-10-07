"use client";

import { useState } from "react";
import { useEmployeeStore } from "../../stores/useEmployeeStore";

export default function AddEmployeeModal() {
  const { addEmployee } = useEmployeeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEmployee(form);
    setForm({ name: "" });
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button className="btn btn-primary mb-4" onClick={() => setIsOpen(true)}>
        ➕ Add Employee
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          style={{ position: "fixed" }}
        >
          <div className="bg-base-100 rounded-xl shadow-2xl w-11/12 max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Add New Employee
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={form.name}
                onChange={handleChange}
                required
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
