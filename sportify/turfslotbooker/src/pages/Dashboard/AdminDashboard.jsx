import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Start with null

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    // Load user info
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    setUser({
      name: name || "Unknown",
      email: email || "Unknown",
      role: role || "N/A"
    });

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Show loading until user info is ready
  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 text-lg">
      <h2 className="text-2xl font-semibold mb-4">👋 Welcome, {user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
