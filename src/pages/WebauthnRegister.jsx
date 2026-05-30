import { useState } from "react";
import API from "../services/api";

import {
  startRegistration,
} from "@simplewebauthn/browser";

function StudentWebAuthnRegister() {

  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);
      setStatus("Starting registration...");

      // STEP 1: Get options from backend
      const optionsRes = await API.post(
        "/webauthn/register/options",
        { rollNumber }
      );

      const options = optionsRes.data;

      setStatus("Touch fingerprint / Face ID...");

      // STEP 2: Trigger fingerprint / Face ID
      const credential = await startRegistration({
        optionsJSON: options,
      });

      setStatus("Verifying with server...");

      // STEP 3: Send response to backend
      const verifyRes = await API.post(
        "/webauthn/register/verify",
        {
          rollNumber,
          credential,
        }
      );

      setStatus(verifyRes.data.message);

    } catch (err) {
      console.log(err);

      setStatus(
        err.response?.data?.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Student Fingerprint Registration
        </h1>

        {/* Roll Number Input */}
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading || !rollNumber}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          {loading
            ? "Processing..."
            : "Register Fingerprint / Face ID"}
        </button>

        {/* Status */}
        {status && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {status}
          </p>
        )}

      </div>

    </div>
  );
}

export default StudentWebAuthnRegister;