import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import GlobalAnimations from "./components/GlobalAnimations";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        <GlobalAnimations />

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/rooms" element={<Rooms />} />

          <Route
            path="/rooms/:id"
            element={<RoomDetails />}
          />

          <Route
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />


        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;