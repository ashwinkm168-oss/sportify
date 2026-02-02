import { useEffect, useState } from "react";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/bookings/my-bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => {
        console.error("Failed to load booking history", err);
      });
  }, []);

  const cancelBooking = async (id) => {
    const token = localStorage.getItem("token");
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setBookings(bookings.filter((b) => b._id !== id));
      } else {
        alert(`❌ Cancel failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("❌ Server error.");
    }
  };

  const isCancelable = (date, slot) => {
    const [hourStr, minuteStr = "00"] = slot.split(":");
    const bookingTime = new Date(`${date}T${hourStr.padStart(2, '0')}:${minuteStr.padStart(2, '0')}:00`);
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    return bookingTime > twoHoursLater;
  };

  const isPast = (date, slot) => {
    const [hourStr, minuteStr = "00"] = slot.split(":");
    const bookingTime = new Date(`${date}T${hourStr.padStart(2, '0')}:${minuteStr.padStart(2, '0')}:00`);
    return bookingTime < new Date();
  };

  const formatSlot = (slot) => {
    const [hour, minute = "00"] = slot.split(":");
    const startHour = parseInt(hour, 10);
    const endHour = startHour + 1;

    const formatHour = (h) => {
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12} ${period}`;
    };

    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
  };

  return (
    <div className="w-full bg-gray-900 text-white p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-emerald-400">📝 Booking History</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => {
            const past = isPast(booking.date, booking.slot);
            const cancelable = isCancelable(booking.date, booking.slot);

            return (
              <li
                key={booking._id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="text-sm sm:text-base">
                  <p><span className="font-semibold text-emerald-300">🏟️ Turf name:</span> {booking.turfId?.name || "N/A"}</p>
                  <p><span className="font-semibold text-emerald-300">📅 Date:</span> {booking.date}</p>
                  <p><span className="font-semibold text-emerald-300">⏰ Slot:</span> {formatSlot(booking.slot)}</p>
                </div>

                {!past && cancelable && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                  >
                    ❌ Cancel
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default BookingHistory;
