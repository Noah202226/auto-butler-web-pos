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
      value={customerInfo.serviceId || ""} // ✅ use serviceId here
      onChange={(e) => {
        const selected = services.find((s) => s.$id === e.target.value);
        if (!selected) return;

        setCustomerInfo({
          ...customerInfo,
          serviceId: selected.$id, // ✅ store id
          serviceName: selected.serviceName, // ✅ store name
          servicePrice: selected.servicePrice, // ✅ store price
        });

        console.log("Selected service:", selected);
      }}
    >
      <option value="" disabled>
        {loading ? "Loading services..." : "-- Select Service --"}
      </option>

      {services.map((service) => (
        <option key={service.$id} value={service.$id}>
          {service.serviceName} - ₱{service.servicePrice}
        </option>
      ))}
    </select>
  );
}
