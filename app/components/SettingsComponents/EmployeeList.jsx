"use client";

import { useEffect } from "react";
import { useEmployeeStore } from "../../stores/useEmployeeStore";

export default function EmployeeList() {
  const { employees, fetchEmployees, removeEmployee, loading, error } =
    useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  if (loading)
    return (
      <p className="p-6 text-gray-500 animate-fade-in">Loading employees...</p>
    );
  if (error)
    return (
      <p className="p-6 text-red-500 animate-fade-in">
        Error loading employees: {error}
      </p>
    );

  if (!employees.length) {
    return (
      <div className="text-center py-12 text-gray-400 animate-fade-in">
        No employees found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
      {employees.map((emp) => (
        <div
          key={emp.$id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-5"
        >
          <h2 className="font-semibold text-gray-800 text-lg">{emp.name}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Hired: {new Date(emp.$createdAt).toLocaleDateString()}
          </p>

          {emp.position && (
            <p className="text-sm text-gray-600 mt-2">
              Position: {emp.position}
            </p>
          )}
          {emp.email && (
            <p className="text-sm text-gray-600">Email: {emp.email}</p>
          )}
          {emp.phone && (
            <p className="text-sm text-gray-600">Phone: {emp.phone}</p>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={() => removeEmployee(emp.$id)}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
