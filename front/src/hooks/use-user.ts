import { CreateUserProps, UserLoginProps } from "../types/types";
import useApi from "./use-api";

const useUser = () => {
    const { api } = useApi();

    const createUser = async (payload: CreateUserProps) => {
        const res = await api.post("/users", payload);
        return res.data;
    }

    const authenticateUser = async (payload: UserLoginProps) => {
        const res = await api.post("/users/auth", payload);
        return res;
    }

    const logoutUser = async () => {
        const res = await api.post("/users/logout");
        return res;
    }

    const refreshToken = async () => {
        const res = await api.post("/users/refresh-token");
        return res;
    }

    const getByUsername = async (username: string) => {
        const res = await api.get(`/users/username/${username}`);
        return res;
    }

    const searchAllByUsername = async (username: string) => {
        const res = await api.get(`/users/search?username=${username}`);
        return res;
    }

    return {
        createUser,
        authenticateUser,
        logoutUser,
        refreshToken,
        getByUsername,
        searchAllByUsername
    }
}

export default useUser;