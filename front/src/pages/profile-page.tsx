import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";


function MainColumn() {
    const { username } = useParams<{ username: string }>();

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