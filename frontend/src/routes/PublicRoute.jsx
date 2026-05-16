import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const userData = useSelector((state) => state.user.userData);
  return userData ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;


