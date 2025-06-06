import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TheaterPage from "./pages/TheaterPage";
import ReservationPage from "./pages/ReservationPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import { verifyToken } from "./services/AuthService";
import { CircularProgress, Box } from "@mui/material";
import CreateTheaterPage from "./pages/admin/CreateTheaterPage";
import EditTheaterDetailsPage from "./pages/admin/EditTheaterDetailsPage";
import ManageTheatersPage from "./pages/admin/ManageTheatersPage";
// import CreateMoviePage from "./pages/admin/CreateMoviePage";
import ManageMoviesPage from "./pages/admin/ManageMoviesPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import AdminReportPage from "./pages/admin/AdminReportPage";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(null); // Reset state while verifying
      verifyToken(token)
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, [location]);

  if (isAuthenticated === null) {
    // While verifying the token, show a loading state or spinner
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes for auth users */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/theaters/:id"
          element={
            <PrivateRoute>
              <TheaterPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <ReservationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Protected routes for admin*/}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/create-theater"
          element={
            <PrivateRoute>
              <CreateTheaterPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-theaters"
          element={
            <PrivateRoute>
              <ManageTheatersPage />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/admin/create-movie"
          element={
            <PrivateRoute>
              <CreateMoviePage />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/admin/manage-movies"
          element={
            <PrivateRoute>
              <ManageMoviesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <PrivateRoute>
              <ManageUsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/theaters/:theaterId/edit-details"
          element={
            <PrivateRoute>
              <EditTheaterDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/report"
          element={
            <PrivateRoute>
              <AdminReportPage />
            </PrivateRoute>
          }
        />

        {/* Wildcard route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
