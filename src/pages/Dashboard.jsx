import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "",
    date: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  //prepare chart data
  const statusCounts = applications.reduce((acc, app) => {
  acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#9CA3AF", "#34D399", "#A78BFA", "#F87171"],
      },
    ],
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("applications");
    if (saved) setApplications(JSON.parse(saved));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...applications];
      updated[editIndex] = formData;
      setApplications(updated);
      setEditIndex(null);
    } else {
      setApplications([...applications, formData]);
    }
    setFormData({ company: "", role: "", status: "", date: "" });
  };

  const handleDelete = (index) => {
    const updated = [...applications];
    updated.splice(index, 1);
    setApplications(updated);
    if (editIndex === index) {
      setEditIndex(null);
      setFormData({ company: "", role: "", status: "", date: "" });
    }
  };

  const handleEdit = (index) => {
    setFormData(applications[index]);
    setEditIndex(index);
  };
  const monthlyCounts = applications.reduce((acc, app) => {
  const month = new Date(app.date).toLocaleString("default", { month: "short", year: "numeric" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;     
  }, {}); 

  const barData = {
    labels: Object.keys(monthlyCounts),
    datasets: [
      {
        label: "Applications",
        data: Object.values(monthlyCounts),
        backgroundColor: "#3B82F6",
      },
    ],
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "text-gray-600 bg-gray-100";
      case "Interview":
        return "text-green-600 bg-green-100";
      case "Offer":
        return "text-purple-600 bg-purple-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Job Tracker</h2>
        <nav className="space-y-4">
          <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500">Dashboard</a>
          <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500">Applications</a>
          <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500">Profile</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Toggle Dark Mode
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Logout</button>
        </header>

        <section>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3  gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Applied</h3>
              <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Interviews</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Offers</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>

          {/* Add/Edit Application Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-10 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editIndex !== null ? "Edit Application" : "Add New Application"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className=" dark:bg-gray-800 border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className=" dark:bg-gray-800 border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className=" dark:bg-gray-800 border p-2 rounded"
                required
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className=" dark:bg-gray-800 border p-2 rounded"
                required
              />
              <button
                type="submit"
                className=" col-span-1 md:col-span-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                {editIndex !== null ? "Update Application" : "Add Application"}
              </button>
            </form>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-10 mb-6">
              <h2 className="text-lg font-semibold mb-4">Status Breakdown</h2>
              <div className="w-64 h-64 mx-auto">
                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-10 mb-6">
            <h2 className="text-lg font-semibold mb-4">Applications Per Month</h2>
            <div className="w-full md:w-2/3 h-64 mx-auto">
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" dark:bg-gray-800 w-full md:w-1/3 border p-2 rounded"
            />
          </div>

          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" dark:bg-gray-800 w-full md:w-1/3 border p-2 rounded"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className=" dark:bg-gray-800 w-full md:w-1/4 border p-2 rounded"
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
           
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" dark:bg-gray-800 w-full md:w-1/3 border p-2 rounded"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className=" dark:bg-gray-800 w-full md:w-1/4 border p-2 rounded"
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className=" dark:bg-gray-800 w-full md:w-1/4 border p-2 rounded"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Job Application Table */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
            <table className=" min-w-full bg-white rounded shadow overflow-hidden">
              <thead className=" bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">Company</th>
                  <th className="text-left px-4 py-2">Role</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Date Applied</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications
                    .filter((app) =>
                      app.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      (statusFilter === "" || app.status === statusFilter)
                    )
                    .sort((a, b) => {
                      const dateA = new Date(a.date);
                      const dateB = new Date(b.date);
                      return sortOrder === "newest"
                        ? dateB - dateA
                        : dateA - dateB;
                    })
                    .map((app, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{app.company}</td>
                        <td className="px-4 py-2">{app.role}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{app.date}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

