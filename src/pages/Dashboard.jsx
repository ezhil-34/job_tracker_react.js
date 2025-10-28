import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({ company: "", role: "", status: "", date: "" });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) navigate("/login");
    else fetchApplications();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/applications/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(applications.map((app) => (app._id === editId ? res.data : app)));
        setEditId(null);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/applications`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications([...applications, res.data]);
      }
      setFormData({ company: "", role: "", status: "", date: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (app) => {
    setFormData(app);
    setEditId(app._id);
  };

  // Charts
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      { data: Object.values(statusCounts), backgroundColor: ["#9CA3AF", "#34D399", "#A78BFA", "#F87171"] },
    ],
  };

  const monthlyCounts = applications.reduce((acc, app) => {
    const month = new Date(app.date).toLocaleString("default", { month: "short", year: "numeric" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(monthlyCounts),
    datasets: [{ label: "Applications", data: Object.values(monthlyCounts), backgroundColor: "#3B82F6" }],
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied": return "text-gray-600 bg-gray-100";
      case "Interview": return "text-green-600 bg-green-100";
      case "Offer": return "text-purple-600 bg-purple-100";
      case "Rejected": return "text-red-600 bg-red-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Job Tracker</h2>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Toggle Dark Mode
          </button>
          <button
            onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("loggedInUser"); navigate("/"); }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Logout
          </button>
        </header>

        <section>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Applied</h3>
              <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Interviews</h3>
              <p className="text-3xl font-bold text-green-600">{applications.filter(a => a.status === "Interview").length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Offers</h3>
              <p className="text-3xl font-bold text-purple-600">{applications.filter(a => a.status === "Offer").length}</p>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-10 mb-6">
            <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Application" : "Add New Application"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 dark:text-white-400">
              <input type="text" placeholder="Company" value={formData.company}
                     onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="dark:bg-gray-800 border p-2 rounded" required/>
              <input type="text" placeholder="Role" value={formData.role}
                     onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="dark:bg-gray-800 border p-2 rounded" required/>
              <input type="text" placeholder="Status" value={formData.status}
                     onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="dark:bg-gray-800 border p-2 rounded" required/>
              <input type="date" value={formData.date}
                     onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="dark:bg-gray-800 border p-2 rounded" required/>
              <button type="submit" className="col-span-1 md:col-span-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                {editId ? "Update Application" : "Add Application"}
              </button>
            </form>
          </div>

          {/* Status Pie */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-10 mb-6">
            <h2 className="text-lg font-semibold mb-4">Status Breakdown</h2>
            <div className="w-64 h-64 mx-auto">
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Applications Bar */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-10 mb-6">
            <h2 className="text-lg font-semibold mb-4">Applications Per Month</h2>
            <div className="w-full md:w-2/3 h-64 mx-auto">
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="Search by company..." value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)} className="dark:bg-gray-800 w-full md:w-1/3 border p-2 rounded"/>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="dark:bg-gray-800 w-full md:w-1/4 border p-2 rounded">
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="dark:bg-gray-800 w-full md:w-1/4 border p-2 rounded">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Table */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
            <table className="min-w-full bg-white rounded shadow overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
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
                  .filter((app) => app.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                    (statusFilter === "" || app.status === statusFilter))
                  .sort((a, b) => sortOrder === "newest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date))
                  .map((app) => (
                  <tr key={app._id} className="border-t">
                    <td className="px-4 py-2">{app.company}</td>
                    <td className="px-4 py-2">{app.role}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{app.date}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(app)} className="text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(app._id)} className="text-red-500 hover:underline">Delete</button>
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
