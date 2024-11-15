import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import useUser from "../hooks/use-user";
import { RootState } from "../store/store";
import { ProfilePostsProps } from "../types/types";
import useProfile from "../hooks/use-profile";
import { useToast } from "../contexts/ToastContext";


function MainColumn() {
    const { username } = useParams<{ username: string }>();
    const { getByUsername } = useUser();
    const { followUser, getFollowers } = useProfile();
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
            await followUser(profile.id);
            showSuccess("Agora você está seguindo " + profile.username);
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) return <h1>Carregando...</h1>;

    return (
        <Col md={6}>
            <Row>
                <Col>
                    foto de capa
                </Col>
            </Row>
            <Row>
                <Col md={"auto"}>Foto de perfil</Col>
                <Col className="d-flex gap-2">
                    <span>@{username}</span>
                    <span>{profile?.followers} seguidores</span>
                    {profile && userId == profile.id && <button>Editar perfil</button>}
                    {profile && userId != profile.id && <Button onClick={toggleFollow}>{isFollowing ? 'Seguindo' : 'Seguir'}</Button>}
                </Col>
            </Row>
        </Col>
    )
}

export default function ProfilePage() {

    return (
        <Container fluid>
            <Row>
                <LeftColumn />
                <MainColumn />
                <RightColumn />
            </Row>
        </Container>
    )
}