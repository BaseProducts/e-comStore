import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (!isAuthenticated) {
        // If not logged in as a user, send to the regular Auth page
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default UserProtectedRoute;
