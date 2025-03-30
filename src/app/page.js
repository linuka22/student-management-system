"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    setAdminName(localStorage.getItem("adminName") || "Admin");
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome back, {adminName}!</h1>
      <div className="stats">
        <div className="stat-box">
          <h2>Total Students</h2>
          <p>120</p>
        </div>
        <div className="stat-box">
          <h2>Total Courses</h2>
          <p>10</p>
        </div>
      </div>
    </div>
  );
}
