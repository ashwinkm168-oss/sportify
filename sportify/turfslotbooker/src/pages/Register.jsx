import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.role) newErrors.role = "Please select a role.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("🎉 Registration successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
      } else {
        setErrors({ apiError: data.message });
      }
    } catch (error) {
      setErrors({ apiError: "Something went wrong. Please try again." });
      console.error("Error:", error);
    }
     const navigate = useNavigate(); // ✅ Initialize
     if (response.ok) {
    setSuccess("🎉 Registration successful! Redirecting to login...");
    setTimeout(() => {
      navigate("/login"); // ✅ Redirect after 2 seconds
    }, 2000); // ⏱️ You can adjust delay
  } else {
    setErrors({ apiError: data.message });
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-emerald-400 mb-6">
          📝 Register
        </h2>

        {errors.apiError && (
          <p className="text-red-500 bg-red-500/10 p-2 mb-4 rounded text-sm text-center">
            {errors.apiError}
          </p>
        )}

        {success && (
          <p className="text-green-400 bg-green-500/10 p-2 mb-4 rounded text-sm text-center">
            {success}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="👤 Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
        />
        {errors.name && <p className="text-red-400 text-sm mb-2">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="📧 Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
        />
        {errors.email && <p className="text-red-400 text-sm mb-2">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="🔒 Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
        />
        {errors.password && <p className="text-red-400 text-sm mb-2">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="🔒 Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm mb-2">{errors.confirmPassword}</p>
        )}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded text-white"
        >
          <option value="">-- Select Role --</option>
          <option value="player">Player</option>
          <option value="owner">Turf Owner</option>
          <option disabled value="admin">Admin</option>
        </select>
        {errors.role && <p className="text-red-400 text-sm mb-4">{errors.role}</p>}

        <button
          type="submit"
          className="w-full text-white-700 hover:text-white border border-white-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
