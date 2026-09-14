import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "MANAGER") {
      return (
        <Navigate
          to="/manager/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/customer/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;