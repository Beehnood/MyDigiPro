import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/Login" />;
};

export default PrivateRoute;
