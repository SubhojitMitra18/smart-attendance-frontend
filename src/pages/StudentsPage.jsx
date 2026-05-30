import { useEffect, useState } from "react";

import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} from "../services/studentService";

function StudentsPage() {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    department: "",
    year: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editStudent, setEditStudent] = useState({
    _id: "",
    name: "",
    rollNumber: "",
    department: "",
    year: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch students");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addStudent(formData);

      alert("Student Added");

      setFormData({
        name: "",
        rollNumber: "",
        department: "",
        year: "",
      });

      fetchStudents();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to add student"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await deleteStudent(id);

      alert("Student Deleted");

      fetchStudents();

    } catch (error) {
      alert("Failed to delete student");
    }
  };

  const handleEditClick = (student) => {
    setEditStudent(student);
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditStudent({
      ...editStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateStudent(
        editStudent._id,
        editStudent
      );

      alert("Student Updated");

      setIsModalOpen(false);

      fetchStudents();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update student"
      );
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Student Management
      </h1>

      {/* Add Student Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          Add Student
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Add Student
        </button>

      </form>

      {/* Students Table */}

      <div className="bg-white p-6 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-4">
          Students
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border">

            <thead>

              <tr className="bg-gray-100">

                <th className="border p-2">
                  Name
                </th>

                <th className="border p-2">
                  Roll Number
                </th>

                <th className="border p-2">
                  Department
                </th>

                <th className="border p-2">
                  Year
                </th>

                <th className="border p-2">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {students.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-4"
                  >
                    No Students Found
                  </td>

                </tr>

              ) : (

                students.map((student) => (

                  <tr key={student._id}>

                    <td className="border p-2">
                      {student.name}
                    </td>

                    <td className="border p-2">
                      {student.rollNumber}
                    </td>

                    <td className="border p-2">
                      {student.department}
                    </td>

                    <td className="border p-2">
                      {student.year}
                    </td>

                    <td className="border p-2">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            handleEditClick(student)
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(student._id)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Edit Modal */}

      {isModalOpen && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

            <h2 className="text-2xl font-bold mb-4">
              Edit Student
            </h2>

            <form onSubmit={handleUpdate}>

              <input
                type="text"
                name="name"
                value={editStudent.name}
                onChange={handleEditChange}
                className="border p-2 rounded w-full mb-3"
                placeholder="Name"
                required
              />

              <input
                type="text"
                name="rollNumber"
                value={editStudent.rollNumber}
                onChange={handleEditChange}
                className="border p-2 rounded w-full mb-3"
                placeholder="Roll Number"
                required
              />

              <input
                type="text"
                name="department"
                value={editStudent.department}
                onChange={handleEditChange}
                className="border p-2 rounded w-full mb-3"
                placeholder="Department"
                required
              />

              <input
                type="number"
                name="year"
                value={editStudent.year}
                onChange={handleEditChange}
                className="border p-2 rounded w-full mb-4"
                placeholder="Year"
                required
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default StudentsPage;