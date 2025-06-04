import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    return payload.exp < currentTime;
  } catch (err) {
    return true; // If any error occurs, treat token as expired
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
