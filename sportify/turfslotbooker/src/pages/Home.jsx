import { Link } from "react-router-dom";
import heroImage from "../assets/hero-turf.jpg"; // Ensure this exists

function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Welcome to Sportify...
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-8 drop-shadow-md">
          Book your favorite turf anytime, anywhere with ease ⚽
        </p>

        <div className="flex justify-center gap-6 mt-8">
  <Link
    to="/login"
    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
  >
    🔐 Login
  </Link>
  <Link
    to="/register"
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
  >
    📝 Register
  </Link>
</div>


      </div>
    </div>
  );
}

export default Home;
