"use client";

import { useEmployeeStore } from "../../stores/useEmployeeStore";
import { useState, useEffect } from "react";
import AddEmployeeModal from "../Helpers/AddEmployeeModal";
import { Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployeeList() {
  const { employees, fetchEmployees, removeEmployee, deletingId } =
    useEmployeeStore();
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      await removeEmployee(id);
      toast.success(`${name} removed successfully`);
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr
                  key={emp.$id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{emp.name}</td>
                  <td className="px-4 py-2 text-right">
                    {confirmId === emp.$id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDelete(emp.$id, emp.name)}
                          className="btn btn-error btn-xs text-white"
                          disabled={deletingId === emp.$id}
                        >
                          {deletingId === emp.$id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              Deleting...
                            </>
                          ) : (
                            "Confirm"
                          )}
                        </button>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => setConfirmId(null)}
                          disabled={deletingId === emp.$id}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(emp.$id)}
                        className="btn btn-error btn-xs text-white gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="text-center text-gray-400 py-4 italic"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
