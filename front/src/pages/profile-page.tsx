import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import UserPosts from "../components/UserPosts";
import { useToast } from "../contexts/ToastContext";
import useProfile from "../hooks/use-profile";
import useUser from "../hooks/use-user";
import { RootState } from "../store/store";
import { ProfilePostsProps } from "../types/types";
import { User } from "lucide-react";

function ProfilePosts() {
    const userId = useSelector((state: RootState) => state.auth.userId);
    const posts = useSelector((state: RootState) => state.posts.posts).filter(post => post.userId == userId);

    return (<UserPosts posts={posts} />)
}

function MainColumn() {
    const { username } = useParams<{ username: string }>();
    const { getByUsername } = useUser();
    const { followUser, getFollowers, unfollowUser } = useProfile();
    const { showSuccess } = useToast()
    const userId = useSelector((state: RootState) => state.auth.userId);

    const [profile, setProfile] = useState<ProfilePostsProps | null>(null);
    const [followers, setFollowers] = useState<ProfilePostsProps[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            const res = await getByUsername(username);
            setProfile(res.data);
        }

        fetchProfile();
    }, [username]);

    useEffect(() => {
        if (!profile) return;

        const fetchFollowers = async () => {
            const res = await getFollowers(profile.id);
            setFollowers(res.data);
            setIsFollowing(res.data.some((follower: ProfilePostsProps) => follower.id === userId));
            setLoading(false);
        }

        fetchFollowers();

    }, [profile]);

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

    const profileFollowers = () => {
        console.log(followers);
    }

    if (loading) return <h1>Carregando...</h1>;

    return (
        <Col md={6}>
            <Row className="mb-1">
                <Col style={{ backgroundColor: '#383e47', height: '10rem' }}>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex gap-2 align-items-center">
                    <User />
                    <span>@{username}</span>
                    <span onClick={profileFollowers}>{profile?.followers} seguidores</span>
                    {profile && userId == profile.id && (
                        <Col className="text-end">
                            <Button variant="outline-dark">
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
            {profile && (<ProfilePosts />)}
        </Col>
    )
}

export default function ProfilePage() {

    return (
        <Container fluid>
            <Row className="mt-1">
                <LeftColumn />
                <MainColumn />
                <RightColumn />
            </Row>
        </Container>
    )
}