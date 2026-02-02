import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        const { token, user } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("name", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);

        if (user.role === "admin") navigate("/dashboard/admin");
        else if (user.role === "owner") navigate("/dashboard/owner");
        else navigate("/dashboard/player");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-emerald-400 mb-6">
          🔐 Login
        </h2>

        {error && (
          <p className="text-red-500 bg-red-100 dark:bg-red-500/10 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Don’t have an account?
        </p>

        <div className="text-center mt-2">
          <Link
            to="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
