import { useState } from "react";
import API from "../services/api";
import { startAuthentication } from "@simplewebauthn/browser";

function ScanPage() {
  const [rollNumber, setRollNumber] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // STEP 1: Get location (geofencing)
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          setLatitude(lat);
          setLongitude(lng);

          resolve({ lat, lng });
        },
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    });
  };

  // MAIN ATTENDANCE FLOW
  const handleAttendance = async () => {
    try {
      setLoading(true);
      setStatus("Getting location...");

      // STEP 1: Get GPS
      const loc = await getLocation();

      setStatus("Checking student...");

      // STEP 2: Get WebAuthn options
      const optionsRes = await API.post(
        "/webauthn/auth/options",
        { rollNumber }
      );

      setStatus("Scan fingerprint / Face ID...");

      // STEP 3: Fingerprint authentication
      const credential = await startAuthentication({
        optionsJSON: optionsRes.data,
      });

      setStatus("Verifying identity...");

      // STEP 4: Verify fingerprint + get student identity
      const verifyRes = await API.post(
        "/webauthnAuth/auth/verify",
        {
          rollNumber,
          credential,
          latitude: loc.lat,
          longitude: loc.lng,
        }
      );

      const student = verifyRes.data;

      setStatus("Marking attendance...");

      // STEP 5: Final attendance mark
      const attendanceRes = await API.post(
        "/attendance/mark",
        {
          studentId: student.studentId,
          latitude: loc.lat,
          longitude: loc.lng,
        }
      );

      setStatus(attendanceRes.data.message);

    } catch (err) {
      console.log("ATTENDANCE ERROR:", err);

      setStatus(
        err.response?.data?.message ||
        err.message ||
        "Attendance failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">

      <h1 className="text-2xl font-bold">
        Student Attendance Scanner
      </h1>

      {/* Roll Number Input */}
      <input
        type="text"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        placeholder="Enter Roll Number"
        className="border p-2 rounded w-64"
      />

      {/* Location Display */}
      <div className="text-sm text-gray-600">
        {latitude && longitude ? (
          <p>
            Location captured ✔
          </p>
        ) : (
          <p>
            Location will be used automatically
          </p>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleAttendance}
        disabled={loading || !rollNumber}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Mark Attendance"}
      </button>

      {/* Status */}
      <p className="mt-4 text-center text-blue-600 font-medium">
        {status}
      </p>

    </div>
  );
}

export default ScanPage;