"use client";

import { useEffect, useState } from "react";
import "./ViewCourses.css";

export default function ViewCourses() {
  const [degreePrograms, setDegreePrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch degree programs
        const degreeRes = await fetch("/api/degreePrograms");
        const degreeData = await degreeRes.json();

        // Fetch all courses
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();

        // Ensure coursesData is an array before setting state
        setDegreePrograms(Array.isArray(degreeData) ? degreeData : []);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="courses-container">
      <h2>Degree Programs & Courses</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        degreePrograms.map((degree) => (
          <div key={degree.id} className="degree-card">
            <h3>{degree.name}</h3>
            <ul>
              {courses
                ?.filter((course) => course.degreeProgramId === degree.id)
                .map((course) => (
                  <li key={course.id}>{course.courseName}</li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
