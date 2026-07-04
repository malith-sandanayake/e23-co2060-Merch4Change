import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/context"; 

function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;