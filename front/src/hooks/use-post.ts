import { CreateCommentProps, CreatePostProps, UpdatePostProps } from "../types/types";
import useApi from "./use-api";

const usePost = () => {
    const { api } = useApi();

    const createPost = async (payload: CreatePostProps) => {
        const res = await api.post("/posts", payload);
        return res;
    }

    const fetchAllPosts = async () => {
        const res = await api.get("/posts");
        return res;
    }

    const patchPost = async (payload: UpdatePostProps) => {
        const res = await api.patch("/posts", payload);
        return res;
    }

    const deletePost = async (id: number) => {
        const res = await api.delete(`/posts/${id}`);
        return res;
    }

    const likePost = async (id: number) => {
        const res = await api.post(`/posts/${id}/like`);
        return res;
    }

    const unlikePost = async (id: number) => {
        const res = await api.delete(`/posts/${id}/like`);
        return res;
    }

    const commentOnPost = async (payload: CreateCommentProps) => {
        const res = await api.post(`/posts/${payload.id}/comment`, payload);
        return res;
    }

    const editComment = async (payload: CreateCommentProps) => {
        const res = await api.patch(`/posts/${payload.id}/comment`, payload);
        return res;
    }

    return {
        createPost,
        fetchAllPosts,
        patchPost,
        deletePost,
        likePost,
        unlikePost,
        commentOnPost,
        editComment
    }
}

export default usePost;