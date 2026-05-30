import { useEffect, useState } from "react";

import {
    startSession,
    getActiveSessions,
    endSession,
} from "../services/sessionService";

function SessionPage() {
    const [sessions, setSessions] = useState([]);

    const [formData, setFormData] = useState({
        department: "",
        year: "",
        subject: "",
        room: "",
        duration: 10,
    });

    useEffect(() => {
        fetchSessions();

        const interval = setInterval(() => {
            fetchSessions();
        }, 10000); // every 10 sec

        return () => clearInterval(interval);

    }, []);

    const fetchSessions = async () => {
        try {
            const res = await getActiveSessions();
            setSessions(res.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load sessions");
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
            await startSession(formData);

            alert("Attendance Session Started");

            setFormData({
                department: "",
                year: "",
                subject: "",
                room: "",
                duration: 10,
            });

            fetchSessions();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to start session"
            );
        }
    };

    const handleEndSession = async (id) => {
        const confirmEnd = window.confirm(
            "End this attendance session?"
        );

        if (!confirmEnd) return;

        try {
            await endSession(id);

            alert("Session Ended");

            fetchSessions();
        } catch (error) {
            alert("Failed to end session");
        }
    };

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Attendance Session Management
            </h1>

            {/* Permanent QR Info */}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">

                <h2 className="font-semibold text-lg">
                    Permanent QR URL
                </h2>

                <p className="text-gray-700 mt-2">
                    https://yourdomain.com
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    This URL should be encoded into the
                    permanent QR code placed outside
                    classrooms.
                </p>

            </div>

            {/* Start Session */}

            <div className="bg-white p-6 rounded-xl shadow mb-8">

                <h2 className="text-xl font-semibold mb-4">
                    Start Attendance Session
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-4"
                >

                    {/* Department */}

                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        required
                    >
                        <option value="">
                            Select Department
                        </option>

                        <option value="BCA">
                            BCA
                        </option>

                        <option value="BBA Hospital Management">
                            BBA Hospital Management
                        </option>

                        <option value="BSc Hotel & Hospitality">
                            BSc Hotel & Hospitality
                        </option>

                    </select>

                    {/* Year */}

                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        required
                    >
                        <option value="">
                            Select Year
                        </option>

                        <option value="1">
                            1st Year
                        </option>

                        <option value="2">
                            2nd Year
                        </option>

                        <option value="3">
                            3rd Year
                        </option>

                        <option value="4">
                            4th Year
                        </option>

                    </select>

                    {/* Subject */}

                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject Name"
                        value={formData.subject}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        required
                    />

                    {/* Room */}

                    <input
                        type="text"
                        name="room"
                        placeholder="Room Number"
                        value={formData.room}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        required
                    />

                    {/* Duration */}

                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="border p-3 rounded"
                    >
                        <option value="5">
                            5 Minutes
                        </option>

                        <option value="10">
                            10 Minutes
                        </option>

                        <option value="15">
                            15 Minutes
                        </option>

                        <option value="20">
                            20 Minutes
                        </option>

                        <option value="30">
                            30 Minutes
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="bg-green-600 text-white rounded p-3"
                    >
                        Start Session
                    </button>

                </form>

            </div>

            {/* Active Sessions */}

            <div className="bg-white p-6 rounded-xl shadow">

                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-xl font-semibold">
                        Active Sessions
                    </h2>

                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
                        {sessions.length} Active
                    </span>

                </div>

                {sessions.length === 0 ? (
                    <p className="text-gray-500">
                        No active sessions found.
                    </p>
                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full border">

                            <thead>

                                <tr className="bg-gray-100">

                                    <th className="border p-2">
                                        Department
                                    </th>

                                    <th className="border p-2">
                                        Year
                                    </th>

                                    <th className="border p-2">
                                        Subject
                                    </th>

                                    <th className="border p-2">
                                        Room
                                    </th>

                                    <th className="border p-2">
                                        Remaining
                                    </th>

                                    <th className="border p-2">
                                        Ends At
                                    </th>

                                    <th className="border p-2">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {sessions.map((session) => (

                                    <tr key={session._id}>

                                        <td className="border p-2">
                                            {session.department}
                                        </td>

                                        <td className="border p-2">
                                            {session.year}
                                        </td>

                                        <td className="border p-2">
                                            {session.subject}
                                        </td>

                                        <td className="border p-2">
                                            {session.room}
                                        </td>
                                        <td className="border p-2">
                                            {Math.max(
                                                0,
                                                Math.floor(
                                                    (
                                                        new Date(session.endTime) -
                                                        new Date()
                                                    ) / 1000 / 60
                                                )
                                            )} mins
                                        </td>
                                        <td className="border p-2">
                                            {new Date(
                                                session.endTime
                                            ).toLocaleString()}
                                        </td>

                                        <td className="border p-2 text-center">

                                            <button
                                                onClick={() =>
                                                    handleEndSession(
                                                        session._id
                                                    )
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                            >
                                                End Session
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default SessionPage;