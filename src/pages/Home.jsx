export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="text-center p-8 bg-white rounded shadow-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Job Tracker</h1>
        <p className="text-gray-700 mb-6">Track your job applications with ease and clarity.</p>
        <div className="space-x-4">
          <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Sign In</a>
          <a href="/register" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Sign Up</a>
        </div>
      </div>
    </div>
  );
}