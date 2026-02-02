import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BookSlot() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [turf, setTurf] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const slots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00"
  ];

  useEffect(() => {
    fetch(`http://localhost:5000/api/turfs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Turf not found");
        return res.json();
      })
      .then(data => setTurf(data))
      .catch(err => {
        console.error("Failed to load turf", err);
        navigate("/dashboard/player");
      });
  }, [id, navigate]);

  useEffect(() => {
    if (!selectedDate) return;
    fetch(`http://localhost:5000/api/bookings/slots/${id}/${selectedDate}`)
      .then(res => res.json())
      .then(data => setBookedSlots(data))
      .catch(err => {
        console.error("Failed to load booked slots:", err);
        setBookedSlots([]);
      });
  }, [selectedDate, id]);

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required to book a turf.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          turfId: id,
          date: selectedDate,
          slot: selectedSlot
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Slot booked successfully!");
        setSelectedSlot("");
        setBookedSlots((prev) => [...prev, selectedSlot]);
      } else {
        alert(`❌ Booking failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Server error. Please try again.");
    }
  };

  const formatTime = (h) => {
    const period = h >= 12 ? "PM" : "AM";
    const formatted = h % 12 === 0 ? 12 : h % 12;
    return `${formatted}:00 ${period}`;
  };

  if (!turf) {
    return <div className="p-6 text-lg text-white bg-gray-900 min-h-screen">Loading turf...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-emerald-400 mb-2">📅 Book a Slot</h1>
        <h2 className="text-xl font-semibold mb-1">{turf.name}</h2>
        <p className="text-gray-300">📍 {turf.location} | ₹{turf.price}/hr | {turf.size}</p>
      </div>

      {turf.images?.[0] && (
        <img
          src={`http://localhost:5000/uploads/${turf.images[0]}`}
          alt="Turf"
          className="rounded-lg mb-6 w-full max-h-64 object-cover border border-gray-700 shadow"
        />
      )}

      <label className="block text-sm text-gray-400 mb-1">Select Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded mb-6 focus:outline-none focus:ring focus:ring-emerald-500"
        min={new Date().toISOString().split("T")[0]}
        required
      />

      <label className="block text-sm text-gray-400 mb-2">Available Time Slots:</label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
        {slots.map((slot) => {
          const [hourStr] = slot.split(":");
          const hour = parseInt(hourStr, 10);
          const endHour = hour + 1;

          const now = new Date();
          const selected = new Date(selectedDate);
          const isToday = selected.toDateString() === now.toDateString();

          const slotTime = new Date(selected);
          slotTime.setHours(hour, 0, 0, 0);

          const isPast = isToday && slotTime < now;
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;

          const isDisabled = isBooked || isPast;

          return (
            <button
              key={slot}
              type="button"
              disabled={isDisabled}
              onClick={() => setSelectedSlot(slot)}
              className={`py-2 px-3 rounded font-semibold transition text-white shadow-sm
                ${isDisabled
                  ? "bg-red-600 cursor-not-allowed opacity-70"
                  : isSelected
                  ? "bg-emerald-800 ring-2 ring-emerald-400"
                  : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {formatTime(hour)} - {formatTime(endHour)}
            </button>
          );
        })}

      </div>

      <button
        onClick={handleBooking}
        disabled={!selectedDate || !selectedSlot}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-lg font-bold transition disabled:bg-gray-600"
      >
        📌 Book Now
      </button>
    </div>
  );
}

export default BookSlot;
