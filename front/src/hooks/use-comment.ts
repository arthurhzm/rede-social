import useApi from "./use-api";

const useComment = () => {
    const { api } = useApi();

    const deleteComment = async (id: number) => {
        const res = await api.delete(`/comments/${id}`);
        return res;
    }

    return {
        deleteComment
    }
}

export default useComment;