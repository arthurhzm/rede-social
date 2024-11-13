import { CreatePostProps } from "../types/types";
import useApi from "./use-api";

const usePost = () => {
    const { api } = useApi();

    const createPost = async (payload: CreatePostProps) => {
        const res = await api.post("/posts", payload);
        return res.data;
    }

    const fetchAllPosts = async () => {
        const res = await api.get("/posts");
        return res;
    }

    return {
        createPost,
        fetchAllPosts   
    }
}

export default usePost;