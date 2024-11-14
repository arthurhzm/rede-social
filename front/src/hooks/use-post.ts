import { CreatePostProps, UpdatePostProps } from "../types/types";
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

    const updatePost = async (payload: UpdatePostProps) => {
        const res = await api.patch("/posts", payload);
        return res;
    }

    return {
        createPost,
        fetchAllPosts,
        updatePost
    }
}

export default usePost;