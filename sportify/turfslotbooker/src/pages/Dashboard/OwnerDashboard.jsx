import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "owner") {
      navigate("/login");
      return;
    }

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    setUser({
      name: name || "Unknown",
      email: email || "Unknown",
      role: role || "N/A",
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-emerald-400">
          👋 Welcome, {user.name}
        </h2>
        <div className="space-y-2">
          <p><span className="font-semibold">📧 Email:</span> {user.email}</p>
          <p><span className="font-semibold">🛡️ Role:</span> {user.role}</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard/owner/add-turf"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition"
          >
            ➕ Add Turf
          </Link>

          <button
            onClick={() => navigate("/owner/bookings")}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded transition"
          >
            📖 View Bookings
          </button>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
