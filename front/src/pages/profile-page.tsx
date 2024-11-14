import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import useUser from "../hooks/use-user";
import { ProfilePostsProps } from "../types/types";


function MainColumn() {
    const { username } = useParams<{ username: string }>();
    const { getByUsername } = useUser();
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

    return (
        <Col md={6}>
            <Row>
                <Col>
                    foto de capa
                </Col>
            </Row>
            <Row>
                <Col md={"auto"}>Foto de perfil</Col>
                <Col>
                    <span>@{username}</span>
                    {profile && userId == profile.id && <button>Editar perfil</button>}
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