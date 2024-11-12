import { CreateUserProps, UserLoginProps } from "../types/types";
import useApi from "./use-api";

const useUser = () => {
    const { api } = useApi();

    const createUser = async (payload: CreateUserProps) => {
        const res = await api.post("/users", payload);
        return res.data;
    }

    const login = async (payload: UserLoginProps) => {
        const res = await api.post("/users/auth", payload);
        return res.data;
    }

    return {
        createUser,
        login
    }
}

export default useUser;