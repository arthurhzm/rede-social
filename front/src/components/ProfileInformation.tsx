import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useToast } from "../contexts/ToastContext";
import useProfile from "../hooks/use-profile";
import { RootState } from "../store/store";
import { ProfilePostsProps } from "../types/types";
import { useNavigate } from "react-router-dom";
import { PATH } from "../routes/routes";

type ProfileInformationProps = {
    userProfile: ProfilePostsProps
}

export default function ProfileInformation({ userProfile }: ProfileInformationProps) {
    const userId = useSelector((state: RootState) => state.auth.userId);
    const { getFollowers, followUser, unfollowUser } = useProfile();
    const { showSuccess } = useToast();
    const navigate = useNavigate();

    const [followers, setFollowers] = useState<ProfilePostsProps[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [profile, setProfile] = useState<ProfilePostsProps>(userProfile);


    useEffect(() => {
        if (!profile) return;

        const fetchFollowers = async () => {
            const res = await getFollowers(profile.id);
            setFollowers(res.data);
            setIsFollowing(res.data.some((follower: ProfilePostsProps) => follower.id === userId));
        }

        fetchFollowers();

    }, [profile]);

    const profileFollowers = () => {
        console.log(followers);
    }

    const toggleFollow = async () => {
        if (!profile) return;

        try {
            if (isFollowing) {
                await unfollowUser(profile.id);
            } else {
                await followUser(profile.id);
            }

            const message = isFollowing ? "Você deixou de seguir " : "Agora você está seguindo ";
            showSuccess(message + profile.username);
            setProfile({ ...profile, followers: isFollowing ? profile.followers - 1 : profile.followers + 1 });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Row>
            <Col className="d-flex gap-2 align-items-center">
                <div onClick={() => navigate(PATH.profile + '/' + profile.username)}>
                    <User />
                    <span>@{profile?.username}</span>
                </div>
                <span onClick={profileFollowers}>{profile?.followers} seguidores</span>
                {profile && userId == profile.id && (
                    <Col className="text-end">
                        <Button variant="outline-darkep">
                            Editar perfil
                        </Button>
                    </Col>
                )
                }

                {profile && userId != profile.id &&
                    <Button onClick={toggleFollow}>
                        {isFollowing ? 'Seguindo' : 'Seguir'}
                    </Button>
                }
            </Col>
        </Row>
    )
}