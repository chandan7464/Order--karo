import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const OwnerRoute = () => {
  const userData = useSelector((state) => state.user.userData);
  return userData?.role === "owner" ? <Outlet /> : <Navigate to="/" replace />;
};

export default OwnerRoute;