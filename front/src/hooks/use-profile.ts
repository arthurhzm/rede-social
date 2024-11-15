import useApi from "./use-api"

const useProfile = () => {
    const { api } = useApi();

    const followUser = async (userId: number) => {
        const res = await api.post(`/users/${userId}follow`);
        return res;
    }

    return {
        followUser
    }
}

export default useProfile;