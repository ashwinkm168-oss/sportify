import { useEffect, useState } from "react";
// ❌ Removed this line: import OwnerBookingHistory from "./pages/Owner/OwnerBookingHistory";

function OwnerBookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/bookings/owner", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => {
        console.error("Failed to load bookings", err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📖 Turf Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="border p-4 rounded shadow-md bg-white"
            >
              <p><strong>Player:</strong> {booking.playerId?.name || "N/A"}</p>
              <p><strong>Turf:</strong> {booking.turfId?.name}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Slot:</strong> {booking.slot}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OwnerBookingHistory;
