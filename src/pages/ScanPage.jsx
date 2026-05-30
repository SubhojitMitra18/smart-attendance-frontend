import { useState } from "react";
import API from "../services/api";
import { startAuthentication } from "@simplewebauthn/browser";

function ScanPage() {
  const [rollNumber, setRollNumber] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    });
  };

  const handleAttendance = async () => {
    try {
      setLoading(true);
      setStatus("Getting location...");

      // STEP 1: GPS
      const location = await getLocation();

      setStatus("Fetching authentication options...");

      // STEP 2: Get WebAuthn options
      const optionsRes = await API.post(
        "/webauthn/auth/options",
        { rollNumber }
      );

      setStatus("Please scan fingerprint / Face ID...");

      // STEP 3: Fingerprint authentication
      const credential = await startAuthentication({
        optionsJSON: optionsRes.data,
      });

      setStatus("Verifying identity...");

      // STEP 4: Verify WebAuthn
      const verifyRes = await API.post(
        "/webauthn/auth/verify",
        {
          rollNumber,
          credential: JSON.parse(JSON.stringify(credential)),
          latitude: location.latitude,
          longitude: location.longitude,
        }
      );

      const student = verifyRes.data;

      setStatus("Marking attendance...");

      // STEP 5: Mark attendance
      const attendanceRes = await API.post(
        "/attendance/mark",
        {
          studentId: student.studentId,
          latitude: location.latitude,
          longitude: location.longitude,
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
        Smart Attendance Scanner
      </h1>

      <input
        type="text"
        placeholder="Enter Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        className="border p-2 rounded w-64"
      />

      <button
        onClick={handleAttendance}
        disabled={loading || !rollNumber}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Mark Attendance"}
      </button>

      <p className="text-blue-600 text-center mt-4">
        {status}
      </p>

    </div>
  );
}

export default ScanPage;