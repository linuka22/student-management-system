'use client'; // Add this to indicate this file is a client component

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

// Set the root element for react-modal to avoid accessibility errors
Modal.setAppElement('body'); // Try using 'body' or adjust to a suitable selector

const ViewStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDegreeProgram, setNewDegreeProgram] = useState('');
  const [newCourses, setNewCourses] = useState('');

  // Fetch students data from API
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await axios.get('/api/students'); // Adjust API endpoint as needed
      setStudents(response.data);
    };
    fetchStudents();
  }, []);

  // Open Modal and set selected student
  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setNewDegreeProgram(student.degreeProgram.name); // Assuming degreeProgram is an object
    setNewCourses(student.enrolledCourses.map(course => course.courseName).join(', ')); // Assuming courses is an array of objects
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Update student details
  const handleSaveChanges = async () => {
    const updatedStudent = {
      ...selectedStudent,
      degreeProgram: { name: newDegreeProgram },
      enrolledCourses: newCourses.split(',').map(course => ({ courseName: course.trim() })),
    };

    // Send updated data to backend
    await axios.put(`/api/students/${selectedStudent.id}`, updatedStudent);

    // Update UI and close modal
    setStudents(prevState =>
      prevState.map(student =>
        student.id === selectedStudent.id ? updatedStudent : student
      )
    );
    handleCloseModal();
  };

  return (
    <div>
      <h1>View Students</h1>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Degree Program</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.firstName} {student.lastName}</td> {/* Assuming fullName is not present in the model */}
              <td>{student.degreeProgram.name}</td> {/* Display degree program name */}
              <td>
                <button onClick={() => handleOpenModal(student)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup */}
      {selectedStudent && (
        <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
          <h2>{selectedStudent.firstName} {selectedStudent.lastName}</h2>
          <p><strong>Degree Program:</strong> {selectedStudent.degreeProgram.name}</p>
          <p><strong>DOB:</strong> {selectedStudent.dob}</p>
          <p><strong>Address:</strong> {selectedStudent.address}</p>
          <p><strong>Enrolled Courses:</strong> {selectedStudent.enrolledCourses.map(course => course.courseName).join(', ')}</p>
          
          {/* Edit Form */}
          <div>
            <label>
              Degree Program:
              <input
                type="text"
                value={newDegreeProgram}
                onChange={(e) => setNewDegreeProgram(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Enrolled Courses:
              <input
                type="text"
                value={newCourses}
                onChange={(e) => setNewCourses(e.target.value)}
              />
            </label>
          </div>

          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={handleCloseModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default ViewStudentsPage;
