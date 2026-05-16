import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const userData = useSelector((state) => state.user.userData);
  return userData ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;