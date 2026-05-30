import { Link, Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacher");

    navigate("/teacher/login");
  };

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col">

        <div>
          <h2 className="text-2xl font-bold mb-8">
            Attendance System
          </h2>

          <nav className="flex flex-col gap-4">

            <Link to="/teacher/dashboard">
              Dashboard
            </Link>

            <Link to="/teacher/students">
              Students
            </Link>

            <Link to="/teacher/session">
              Attendance Session
            </Link>

            <Link to="/teacher/reports">
              Reports
            </Link>

          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded"
        >
          Logout
        </button>

      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;