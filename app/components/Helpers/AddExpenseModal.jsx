"use client";
import { useState } from "react";
import useSalesStore from "../../stores/useSaleStore";

export default function AddExpenseModal() {
  const { addExpense } = useSalesStore();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Misc");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addExpense({
      amount: parseFloat(amount),
      category,
      note,
      createdAt: new Date().toISOString(),
    });
    setAmount("");
    setCategory("Misc");
    setNote("");
    document.getElementById("expense_modal").close(); // close modal
  };

  return (
    <>
      {/* Trigger button */}
      {/* <button
        className="btn btn-error"
        onClick={() => document.getElementById("expense_modal").showModal()}
      >
        + Add Expense
      </button> */}

      {/* DaisyUI modal */}
      <dialog id="expense_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add New Expense</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="number"
              placeholder="Amount"
              className="input input-bordered w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <select
              className="select select-bordered w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Rent</option>
              <option>Salary</option>
              <option>Supplies</option>
              <option>Utilities</option>
              <option>Misc</option>
            </select>

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("expense_modal").close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
