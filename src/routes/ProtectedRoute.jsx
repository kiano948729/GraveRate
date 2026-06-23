import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
