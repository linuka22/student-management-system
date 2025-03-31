'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use useRouter for redirect
import Modal from 'react-modal';
import axios from 'axios';
import './view-students.css';
 // Import the session check function

Modal.setAppElement('body');

const ViewStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Check if admin is logged in
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/admin/check-session"); // Use API to check session
      const data = await res.json();
      if (!data.isLoggedIn) {
        router.push("/login"); // Redirect to login page if not logged in
      } else {
        fetchStudents();
      }
    };

    checkSession();
  }, [router]);

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
      setFilteredStudents(response.data); // Initially, show all students
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle search input changes
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.studentId.includes(query)
      );
      setFilteredStudents(filtered);
    }
  };

  // Open modal with student details
  const handleOpenModal = async (student) => {
    setSelectedStudent(student);
    setSelectedCourses(student.enrolledCourses.map(course => course.id));

    try {
      const response = await axios.get(`/api/courses?degreeProgramId=${student.degreeProgram.id}`);
      setAvailableCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }

    setIsModalOpen(true);
    setSuccessMessage("");
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle course selection in the modal
  const handleCourseSelection = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Save the selected courses for the student
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const updatedStudent = {
        id: selectedStudent.id,
        courses: selectedCourses,
      };

      const response = await axios.put(`/api/students`, updatedStudent);

      setStudents(prevState =>
        prevState.map(student =>
          student.id === selectedStudent.id
            ? { ...student, enrolledCourses: availableCourses.filter(course => selectedCourses.includes(course.id)) }
            : student
        )
      );

      setFilteredStudents(prevState =>
        prevState.map(student =>
          student.id === selectedStudent.id
            ? { ...student, enrolledCourses: availableCourses.filter(course => selectedCourses.includes(course.id)) }
            : student
        )
      );

      setSuccessMessage(response.data.message);
      setIsSaving(false);
    } catch (error) {
      console.error("Error updating student:", error);
      setSuccessMessage("Error updating student.");
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>View Students</h1>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Student ID"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Degree Program</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.studentId}</td>
                <td>{student.firstName} {student.lastName}</td>
                <td>{student.degreeProgram.name}</td>
                <td>
                  <button onClick={() => handleOpenModal(student)}>View Details</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No students found</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedStudent && (
        <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
          <h2>{selectedStudent.firstName} {selectedStudent.lastName}</h2>
          <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
          <p><strong>DOB:</strong> {selectedStudent.dob}</p>
          <p><strong>Address:</strong> {selectedStudent.address}</p>
          <p><strong>Degree Program:</strong> {selectedStudent.degreeProgram.name}</p>
          <p><strong>Enrolled Courses:</strong></p>
          <div>
            {availableCourses.map(course => (
              <label key={course.id}>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleCourseSelection(course.id)}
                />
                {course.courseName}
              </label>
            ))}
          </div>

          {successMessage && <p>{successMessage}</p>}
          <button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={handleCloseModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default ViewStudentsPage;
