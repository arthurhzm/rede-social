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


function MainColumn() {
    const { username } = useParams<{ username: string }>();
    const { getByUsername } = useUser();
    const { followUser } = useProfile();
    const userId = useSelector((state: RootState) => state.auth.userId);
    console.log(userId);
    

    const [profile, setProfile] = useState<ProfilePostsProps | null>(null);

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            const res = await getByUsername(username);
            setProfile(res.data);
        }

        fetchProfile();
    }, [username]);

    const handleFollow = async () => {
        if (!profile) return;

        try {
            await followUser(profile.id);
        } catch (error) {
            console.log(error);
        }
    }

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
                    {profile && userId == profile.id && <button>Editar perfil</button>}
                    {profile && userId != profile.id && <Button onClick={handleFollow}>Seguir</Button>}
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