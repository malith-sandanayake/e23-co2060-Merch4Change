import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/Context"; 

function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default ProtectedRoute;
