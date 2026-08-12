import React, { useEffect, useRef, useState } from "react";

// Records one hit per page load against /api/views, which owns the total.
// When the call fails — offline, storage unconfigured, or `npm run dev` where
// there is no serverless function — the counter renders nothing rather than
// showing a number it cannot stand behind.
const ViewCounter = () => {
  const [views, setViews] = useState(null);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return; // StrictMode runs effects twice in dev
    counted.current = true;

    fetch("/api/views", { method: "POST" })
      .then((response) => (response.ok ? response.json() : Promise.reject(response)))
      .then((data) => setViews(data.views))
      .catch(() => {});
  }, []);

  if (views === null) return null;

  return (
    <p className="flex items-center gap-2">
      <span aria-hidden="true">·</span>
      <span>
        {views.toLocaleString()} {views === 1 ? "view" : "views"}
      </span>
    </p>
  );
};

export default ViewCounter;
