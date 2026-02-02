import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PlayerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [turfs, setTurfs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "player") {
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

    fetch("http://localhost:5000/api/turfs/all")
      .then((res) => res.json())
      .then((data) => setTurfs(data))
      .catch((err) => console.error("Failed to fetch turfs", err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleShowSlots = (turfId) => {
    navigate(`/book-slot/${turfId}`);
  };

  if (!user) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">👋 Welcome, {user.name}</h2>
          <p className="text-gray-400">📧 {user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          🚪 Logout
        </button>
      </div>

      <div className="mb-8">
        <button
          onClick={() => navigate("/player/bookings")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          📜 View Booking History
        </button>
      </div>

      <h3 className="text-2xl font-semibold mb-4">⚽ Available Turfs</h3>

      {turfs.length === 0 ? (
        <p className="text-gray-400">No turfs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf) => (
            <div
              key={turf._id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 hover:shadow-lg transition"
            >
              {turf.images?.[0] && (
                <img
                  src={`http://localhost:5000/uploads/${turf.images[0]}`}
                  alt="Turf"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h4 className="text-xl font-semibold text-white">{turf.name}</h4>
                <p className="text-gray-400"><strong>📍 Location:</strong> {turf.location}</p>
                <p className="text-gray-400"><strong>⚙️ Size:</strong> {turf.size}</p>
                <p className="text-gray-400"><strong>💰 Price:</strong> ₹{turf.price}/hr</p>
                <p className="text-gray-400"><strong>💰 Contact:</strong> {turf.contact}</p>
                <p className="text-gray-500 text-sm mt-2">{turf.description}</p>

                <button
                  onClick={() => handleShowSlots(turf._id)}
                  className="mt-4 w-full text-white-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                >
                  📅 Show Slots
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerDashboard;
