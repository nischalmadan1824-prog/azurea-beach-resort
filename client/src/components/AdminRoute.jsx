import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not an admin
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin
  return children;
};

export default AdminRoute;