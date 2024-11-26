import { CreateCommentProps } from "../types/types";
import useApi from "./use-api";

const useComment = () => {
    const { api } = useApi();

    const deleteComment = async (id: number) => {
        const res = await api.delete(`/comments/${id}`);
        return res;
    }

    const editComment = async (payload: CreateCommentProps) => {
        const res = await api.patch(`/comments`, payload);
        return res;
    }

    return {
        deleteComment,
        editComment
    }
}

export default useComment;