import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in:", form);
    // Connect to backend later
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
        <div className="space-x-4">
          <a href="/Dashboard" className=" w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">login</a>
         
        </div>
      </form>
    </div>
  );
}