import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import CustomerTrips from "./pages/CustomerTrips";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import CustomerBookings from "./pages/CustomerBookings";
import CustomerPayments from "./pages/CustomerPayments";
import CustomerReviews from "./pages/CustomerReviews";
import CustomerProfile from "./pages/CustomerProfile";
import ManagerBoats from "./pages/ManagerBoats";
import ManagerCrew from "./pages/ManagerCrew";
import ManagerTrips from "./pages/ManagerTrips";
import ManagerBookings from "./pages/ManagerBookings";
import ManagerPayments from "./pages/ManagerPayments";
import ManagerSafetyWeather from "./pages/ManagerSafetyWeather";
import ManagerReviews from "./pages/ManagerReviews";
import ManagerUsers from "./pages/ManagerUsers";
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
  path="/register"
  element={<Register />}
/>

        <Route
  path="/customer/dashboard"
  element={
    <ProtectedRoute allowedRole="CUSTOMER">
      <CustomerDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/customer/trips"
  element={
    <ProtectedRoute allowedRole="CUSTOMER">
      <CustomerTrips />
    </ProtectedRoute>
  }
/>
<Route
  path="/customer/bookings"
  element={
    <ProtectedRoute allowedRole="CUSTOMER">
      <CustomerBookings />
    </ProtectedRoute>
  }
/>


<Route
  path="/customer/payments"
  element={
    <ProtectedRoute allowedRole="CUSTOMER">
      <CustomerPayments />
    </ProtectedRoute>
  }
/>
<Route
  path="/customer/reviews"
  element={
    <ProtectedRoute allowedRole="CUSTOMER">
      <CustomerReviews />
    </ProtectedRoute>
  }
/>
<Route
  path="/customer/profile"
  element={
    <ProtectedRoute allowedRole="CUSTOMER">
      <CustomerProfile />
    </ProtectedRoute>
  }
/>
       <Route
  path="/manager/dashboard"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/boats"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerBoats />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/crew"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerCrew />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/trips"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerTrips />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/bookings"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerBookings />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/payments"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerPayments />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/safety"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerSafetyWeather />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/reviews"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerReviews />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/users"
  element={
    <ProtectedRoute allowedRole="MANAGER">
      <ManagerUsers />
    </ProtectedRoute>
  }
/>
<Route
  path="*"
  element={<Navigate to="/" replace />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;