import { useState } from "react";

function ReportsPage() {
  const [filters, setFilters] = useState({
    department: "",
    year: "",
    date: "",
  });

  const [reports] = useState([]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // Later:
    // Call backend API here
    // Example:
    // GET /api/attendance/reports

    alert("Report API not implemented yet");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Attendance Reports
      </h1>

      {/* Filters */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Filter Reports
        </h2>

        <form
          onSubmit={handleSearch}
          className="grid md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={filters.department}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={filters.year}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded"
          >
            Search
          </button>
        </form>
      </div>

      {/* Report Table */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Attendance Records
        </h2>

        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Student</th>
                <th className="border p-2">Roll</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="border p-2">
                    {report.studentName}
                  </td>

                  <td className="border p-2">
                    {report.rollNumber}
                  </td>

                  <td className="border p-2">
                    {report.department}
                  </td>

                  <td className="border p-2">
                    {report.year}
                  </td>

                  <td className="border p-2">
                    {report.subject}
                  </td>

                  <td className="border p-2">
                    {report.date}
                  </td>

                  <td className="border p-2">
                    Present
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;