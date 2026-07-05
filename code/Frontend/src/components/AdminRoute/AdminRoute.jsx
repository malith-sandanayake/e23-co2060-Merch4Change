import { Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { getUserRole } from "../../utils/authStorage";

function AdminRoute({ children }) {
  const role = getUserRole();

  return (
    <ProtectedRoute>
      {role === "admin" ? children : <Navigate to="/home" replace />}
    </ProtectedRoute>
  );
}

export default AdminRoute;
