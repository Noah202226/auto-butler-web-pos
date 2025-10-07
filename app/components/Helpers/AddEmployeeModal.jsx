"use client";

import { useState } from "react";
import { useEmployeeStore } from "@/store/employeeStore";

export default function AddEmployeeModal() {
  const { addEmployee } = useEmployeeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEmployee(form);
    setForm({ name: "", position: "", phone: "", email: "" });
    setIsOpen(false);
  };

  return (
    <>
      <button className="btn btn-primary mb-4" onClick={() => setIsOpen(true)}>
        ➕ Add Employee
      </button>

      {isOpen && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-lg">
            <h3 className="font-bold text-lg mb-4">Add New Employee</h3>

            <form onSubmit={handleSubmit} className="grid gap-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="position"
                placeholder="Position"
                className="input input-bordered w-full"
                value={form.position}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="input input-bordered w-full"
                value={form.phone}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={handleChange}
              />

              <div className="modal-action">
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
