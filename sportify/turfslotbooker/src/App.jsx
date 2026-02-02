import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookSlot from "./pages/BookSlot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlayerDashboard from "./pages/Dashboard/PlayerDashboard";
import OwnerDashboard from "./pages/Dashboard/OwnerDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import AddTurf from "./pages/owner/AddTurf";
import PrivateRoute from "./components/PrivateRoute";
import BookingHistory from "./pages/player/BookingHistory";
import OwnerBookingHistory from "./pages/Owner/OwnerBookingHistory";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookSlot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/player"
          element={
            <PrivateRoute allowedRoles={["player"]}>
              <PlayerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/owner"
          element={
            <PrivateRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/owner/add-turf"
          element={
            <PrivateRoute allowedRoles={["owner"]}>
              <AddTurf />
            </PrivateRoute>
          }
        />
        <Route path="/book-slot/:id" element={<BookSlot />} />
        <Route path="/player/bookings" element={<BookingHistory />} />
        <Route path="/owner/bookings" element={<OwnerBookingHistory />} />

      </Routes>
    </Router>
  );
}

export default App;
