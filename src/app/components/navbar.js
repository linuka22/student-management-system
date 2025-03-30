"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("adminName");
    setIsLoggedIn(!!admin);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });

    localStorage.removeItem("adminName");
    setIsLoggedIn(false);
    router.push("/login");
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
        <li><Link href="/admin-activity">Admin Activity</Link></li>
        {isLoggedIn ? (
          <li><button onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link href="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

