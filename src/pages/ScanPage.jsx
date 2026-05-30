import { useState } from "react";
import API from "../services/api";

function ScanPage() {
  const [formData, setFormData] = useState({
    rollNumber: "",
    department: "",
    year: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // GEOLOCATION
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "year"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleAttendance = async () => {
    try {
      setLoading(true);

      setStatus("Getting location...");

      const location = await getLocation();

      console.log("Location:", location);

      setStatus("Verifying session...");

      const res = await API.post(
        "/attendance/mark",
        {
          rollNumber: formData.rollNumber,
          department: formData.department,
          year: formData.year,

          latitude: location.latitude,
          longitude: location.longitude,
        }
      );

      console.log(
        "Attendance Response:",
        res.data
      );

      console.log(
        "Form Data:",
        formData
      );

      setStatus(res.data.message);

      setFormData({
        rollNumber: "",
        department: "",
        year: "",
      });

    } catch (error) {

      console.error(
        "Attendance Error:",
        error
      );

      if (
        error.code === 1
      ) {
        setStatus(
          "Location permission denied"
        );
      } else {
        setStatus(
          error.response?.data?.message ||
          "Attendance failed"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Smart Attendance
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Mark Your Attendance
        </p>

        <input
          type="text"
          name="rollNumber"
          placeholder="Roll Number"
          value={formData.rollNumber}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <button
          onClick={handleAttendance}
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Processing..."
            : "Mark Attendance"}
        </button>

        {status && (
          <div className="mt-5 p-3 rounded bg-gray-100 text-center">
            {status}
          </div>
        )}

      </div>

    </div>
  );
}

export default ScanPage;