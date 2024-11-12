import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "../routes/routes";
import useUser from "../hooks/use-user";

export default function PrivateRoute() {
    const { token, setToken } = useAuth();
    const { refreshToken } = useUser();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            try {
                if (!token) {
                    const res = await refreshToken();
                    setToken(res.data.token);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.error(e);
                setToken('');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, [token, setToken, refreshToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to={PATH.login} />;
}
