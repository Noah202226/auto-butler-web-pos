"use client";
import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval); // cleanup when unmounted
  }, []);

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString();

  return (
    <div className="text-sm font-semibold hidden sm:block">
      {formattedDate} — {formattedTime}
    </div>
  );
}
