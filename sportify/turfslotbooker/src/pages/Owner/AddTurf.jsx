import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTurf() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    contact: "",
    price: "",
    size: "",
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (images.length === 0) {
      setMessage("❌ Please upload at least one image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You are not logged in.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    images.forEach((image) => data.append("images", image));

    try {
      const res = await fetch("http://localhost:5000/api/turfs/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("✅ Turf registered successfully!");
        setTimeout(() => navigate("/dashboard/owner"), 1200);

        setFormData({
          name: "",
          location: "",
          description: "",
          contact: "",
          price: "",
          size: "",
        });
        setImages([]);
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-emerald-400">
          🏟️ Register Your Turf
        </h2>

        {message && (
          <div
            className={`mb-4 text-sm font-medium ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Turf Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />

          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price per hour"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />

          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          >
            <option value="">Select Size</option>
            <option value="5s">5s</option>
            <option value="7s">7s</option>
            <option value="11s">11s</option>
          </select>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded transition duration-300"
          >
            🚀 Submit Turf
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTurf;
