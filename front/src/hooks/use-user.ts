import { CreateUserProps } from "../types/types";
import useApi from "./use-api";

const useUser = () => {
    const { api } = useApi();

    const createUser = async (payload: CreateUserProps) => {
        const res = await api.post("/users", payload);
        return res.data;
    }

    return {
        createUser
    }
}

export default useUser;