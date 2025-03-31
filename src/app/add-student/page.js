"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./AddStudent.css";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    dob: "",
    degreeProgramId: "",
    courses: [],
  });
  const [message, setMessage] = useState("");
  const [degreePrograms, setDegreePrograms] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track login status
  const router = useRouter();

  // Check if the user is logged in by calling the API route
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/admin/check-session"); // API to check session
      const data = await res.json();
      if (!data.isLoggedIn) {
        router.push("/login"); // Redirect to login page if not logged in
      } else {
        setIsLoggedIn(true);
      }
    };

    checkSession();
  }, [router]);

  // Fetch degree programs when component mounts
  useEffect(() => {
    const fetchDegreePrograms = async () => {
      const res = await fetch("/api/degreePrograms");
      const data = await res.json();
      setDegreePrograms(data);
    };

    fetchDegreePrograms();
  }, []);

  const handleDegreeProgramChange = async (e) => {
    const degreeProgramId = e.target.value;
    setFormData({ ...formData, degreeProgramId, courses: [] });

    // Fetch courses for the selected degree program
    try {
      const res = await fetch(`/api/courses?degreeProgramId=${degreeProgramId}`);
      const data = await res.json();
      setAvailableCourses(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAvailableCourses([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCourseSelection = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const courses = checked
        ? [...prevState.courses, value] // Ensure value is stored as a string
        : prevState.courses.filter((course) => course !== value);
      return { ...prevState, courses };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        degreeProgramId: parseInt(formData.degreeProgramId), // Ensure it's a number
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Student added successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        dob: "",
        degreeProgramId: "",
        courses: [],
      });
    } else {
      setMessage(data.message || "Error adding student.");
    }
  };

  if (!isLoggedIn) {
    return <div>Loading...</div>; // Show a loading state while checking login status
  }

  return (
    <div className="form-container">
      <h2>Add Student</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <select
          name="degreeProgramId"
          value={formData.degreeProgramId}
          onChange={handleDegreeProgramChange}
          required
        >
          <option value="">Select Degree Program</option>
          {degreePrograms.map((degree) => (
            <option key={degree.id} value={degree.id}>
              {degree.name}
            </option>
          ))}
        </select>

        {availableCourses.length > 0 && (
          <div>
            <h3>Available Courses</h3>
            {availableCourses.map((course) => (
              <div key={course.id}>
                <input
                  type="checkbox"
                  id={course.id}
                  value={course.id.toString()} // Convert to string
                  checked={formData.courses.includes(course.id.toString())} // Ensure comparison works
                  onChange={handleCourseSelection}
                />
                <label htmlFor={course.id}>{course.courseName}</label>
              </div>
            ))}
          </div>
        )}

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}
