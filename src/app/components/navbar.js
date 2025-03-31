"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [adminName, setAdminName] = useState(null);
  const router = useRouter();

  // Check if admin is logged in on page load
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminName");
    if (storedAdmin) {
      setAdminName(storedAdmin);
    }
  }, []);

  // Logout function
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });

    // Clear session
    localStorage.removeItem("adminName");
    setAdminName(null);
    router.refresh(); // Refresh to update UI
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="StudentHub Logo" />
        <span>StudentHub</span>
      </div>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/add-student">Add Student</Link></li>
        <li><Link href="/view-students">View Students</Link></li>
        <li><Link href="/view-courses">View Courses</Link></li>

        {adminName ? (
          <>
            <li><Link href="/admin-activity">Admin Activity</Link></li>
            <li><span className="admin-name">Hi, {adminName}</span></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <li><Link href="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
