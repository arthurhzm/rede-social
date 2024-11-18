import useApi from "./use-api"

const useProfile = () => {
    const { api } = useApi();

    const followUser = async (userId: number) => {
        const res = await api.post(`/users/${userId}/follow`);
        return res;
    }

    const getFollowers = async (userId: number) => {
        const res = await api.get(`/users/${userId}/followers`);
        return res;
    }

    const unfollowUser = async (userId: number) => {
        const res = await api.delete(`/users/${userId}/unfollow`);
        return res;
    }

    return {
        followUser,
        getFollowers,
        unfollowUser
    }
}

export default useProfile;