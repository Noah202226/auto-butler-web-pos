"use client";

import { useEffect } from "react";
import { useEmployeeStore } from "../../stores/useEmployeeStore";

export default function EmployeeList() {
  const { employees, fetchEmployees, removeEmployee, loading, error } =
    useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  if (loading) return <p className="p-4">Loading employees...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  if (!employees.length) {
    return (
      <div className="text-center py-10 text-gray-400">No employees found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {employees.map((emp) => (
        <div key={emp.$id} className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{emp.name}</h2>
            <p className="text-sm text-gray-500">
              Hired: {new Date(emp.$createdAt).toLocaleDateString()}
            </p>
            {emp.position && (
              <p className="text-sm text-gray-600">Position: {emp.position}</p>
            )}
            {emp.email && (
              <p className="text-sm text-gray-600">Email: {emp.email}</p>
            )}
            {emp.phone && (
              <p className="text-sm text-gray-600">Phone: {emp.phone}</p>
            )}

            <div className="card-actions justify-end mt-4">
              <button
                onClick={() => removeEmployee(emp.$id)}
                className="btn btn-error btn-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
