"use client";

import { useEffect } from "react";
import { useEmployeeStore } from "../../stores/useEmployeeStore";

export default function EmployeeSelect({ customerInfo, setCustomerInfo }) {
  const { employees, fetchEmployees, loading } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <select
      className="select select-bordered w-full"
      value={customerInfo.employeeId || ""}
      onChange={(e) => {
        const selected = employees.find((emp) => emp.$id === e.target.value);
        setCustomerInfo({
          ...customerInfo,
          employeeId: selected?.$id,
          employee: selected?.name,
        });
      }}
    >
      <option value="" disabled>
        {loading ? "Loading employees..." : "-- Select Employee --"}
      </option>

      {employees.map((emp) => (
        <option key={emp.$id} value={emp.$id}>
          {emp.name}
        </option>
      ))}
    </select>
  );
}
