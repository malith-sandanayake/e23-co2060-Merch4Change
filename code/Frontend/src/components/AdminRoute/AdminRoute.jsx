import { Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { useAuth } from "../../context/Context";

function AdminRoute({ children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === "admin" ? children : <Navigate to="/home" replace />}
    </ProtectedRoute>
  );
}

export default AdminRoute;
