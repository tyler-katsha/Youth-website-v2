import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { DefaultSkeleton } from "../skeletons/pages/DefaultSkeleton";
import type { ProtectedRouteProps } from "../types/auth";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

    const { isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return <DefaultSkeleton />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}