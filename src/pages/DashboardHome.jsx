import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";
import { getActiveSessions } from "../services/sessionService";

function DashboardHome() {
  const [studentCount, setStudentCount] = useState(0);
  const [activeSessionCount, setActiveSessionCount] = useState(0);

  const teacher = JSON.parse(
    localStorage.getItem("teacher")
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const studentsRes = await getStudents();

      setStudentCount(studentsRes.data.length);

      const sessionsRes =
        await getActiveSessions();

      setActiveSessionCount(
        sessionsRes.data.length
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-2">
        Welcome, {teacher?.name}
      </h1>

      <p className="text-gray-600 mb-8">
        Attendance Management Dashboard
      </p>

      {/* Stats Cards */}

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-lg font-semibold">
            Total Students
          </h2>

          <p className="text-4xl font-bold mt-3">
            {studentCount}
          </p>

        </div>

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-lg font-semibold">
            Active Sessions
          </h2>

          <p className="text-4xl font-bold mt-3">
            {activeSessionCount}
          </p>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <a
            href="/teacher/students"
            className="bg-blue-600 text-white p-5 rounded-xl text-center"
          >
            Manage Students
          </a>

          <a
            href="/teacher/session"
            className="bg-green-600 text-white p-5 rounded-xl text-center"
          >
            Attendance Session
          </a>

          <a
            href="/teacher/reports"
            className="bg-purple-600 text-white p-5 rounded-xl text-center"
          >
            View Reports
          </a>

        </div>

      </div>

    </div>
  );
}

export default DashboardHome;