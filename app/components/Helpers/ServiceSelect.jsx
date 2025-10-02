"use client";

import { useEffect } from "react";
import { useServiceStore } from "../../stores/useServiceStore";

export default function ServiceSelect({ customerInfo, setCustomerInfo }) {
  const { services, fetchServices, loading } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <select
      className="select select-bordered w-full"
      value={customerInfo.serviceName || ""}
      onChange={(e) => {
        console.log(e.target.value);
        setCustomerInfo({
          ...customerInfo,
          service: e.target.value,
          servicePrice: services.find((s) => s.$id === e.target.value)
            ?.servicePrice,
        });
        console.log(customerInfo.servicePrice);
      }}
    >
      <option value="" disabled>
        {loading ? "Loading services..." : "-- Select Service --"}
      </option>

      {services.map((service) => (
        <option key={service.$id} value={service.$id}>
          {service?.serviceName} - ₱{service?.servicePrice}
        </option>
      ))}
    </select>
  );
}
