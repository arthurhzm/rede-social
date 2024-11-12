import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "../routes/routes";
import useUser from "../hooks/use-user";

export default function PrivateRoute() {
    const { token, setToken } = useAuth();
    const { refreshToken } = useUser()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkToken = async () => {
            try {
                const res = await refreshToken();
                setToken(res.data.token);
            } catch (e) {
                console.error(e);
                setToken('');
            } finally {
                setLoading(false);
            }
        };

        if (!token) {
            checkToken();
        } else {
            setLoading(false);
        }
    }, []); // Empty dependency array to run only once

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    return token ? <Outlet /> : <Navigate to={PATH.login} />
}