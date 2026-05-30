import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// https://1tn3fbkz-5173.inc1.devtunnels.ms/

import ProtectedRoute from "./components/ProtectedRoute";

import TeacherLogin from "./pages/TeacherLogin";

import ScanPage from "./pages/ScanPage";
import SuccessPage from "./pages/SuccessPage";
import ErrorPage from "./pages/ErrorPage";

import DashboardLayout from "./layouts/DashboardLayout";

import DashboardHome from "./pages/DashboardHome";
import StudentsPage from "./pages/StudentsPage";
import SessionPage from "./pages/SessionPage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Student Side */}

        <Route
          path="/"
          element={<ScanPage />}
        />

        <Route
          path="/success"
          element={<SuccessPage />}
        />

        <Route
          path="/error"
          element={<ErrorPage />}
        />

        {/* Teacher Login */}

        <Route
          path="/teacher/login"
          element={<TeacherLogin />}
        />

        {/* Teacher Dashboard */}

        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<DashboardHome />}
          />

          <Route
            path="students"
            element={<StudentsPage />}
          />

          <Route
            path="session"
            element={<SessionPage />}
          />

          <Route
            path="reports"
            element={<ReportsPage />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;