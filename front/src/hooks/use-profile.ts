import useApi from "./use-api"

const useProfile = () => {
    const { api } = useApi();

    const followUser = async (userId: number) => {
        const res = await api.post(`/users/follow/${userId}`);
        return res;
    }

    return {
        followUser
    }
}

export default useProfile;