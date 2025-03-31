"use client";

import { useEffect, useState } from "react";
import "./home.css"; // Import the CSS file

export default function Home() {
  const [adminName, setAdminName] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalDegreePrograms, setTotalDegreePrograms] = useState(0);

  useEffect(() => {
    // Get the admin name from localStorage
    const storedAdmin = localStorage.getItem("adminName");
    if (storedAdmin) {
      setAdminName(storedAdmin);
    }

    // Fetch total students and degree programs from the backend API
    const fetchData = async () => {
      try {
        const studentsRes = await fetch("/api/stats/total-students");
        const programsRes = await fetch("/api/stats/total-degree-programs");

        if (studentsRes.ok && programsRes.ok) {
          const studentsData = await studentsRes.json();
          const programsData = await programsRes.json();

          setTotalStudents(studentsData.total);
          setTotalDegreePrograms(programsData.total);
        } else {
          console.error("Failed to fetch data from the server.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome back, {adminName ? adminName : "Admin"}!</h1>

      {/* Stats Section */}
      <div className="stats">
        <div className="stat-box">
          <h2>Total Students</h2>
          <p>{totalStudents}</p>
        </div>
        <div className="stat-box">
          <h2>Total Degree Programs</h2>
          <p>{totalDegreePrograms}</p>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/add-student">➕ Add Student</a></li>
          <li><a href="/view-students">📋 View Students</a></li>
          <li><a href="/view-degree-programs">🎓 View Degree Programs</a></li>
        </ul>
      </div>

      {/* Upcoming Deadlines Section */}
      <div className="upcoming-deadlines">
        <h3>Upcoming Deadlines</h3>
        <ul>
          <li>📌 Course Registration Deadline: 1st May 2025</li>
          <li>📌 Student Application Deadline: 15th May 2025</li>
        </ul>
      </div>
    </div>
  );
}
