import { Col, Container, FloatingLabel, FormControl, InputGroup, Row, Stack } from "react-bootstrap";

function LoginForm() {
    return (
        <>
            <Row className="mb-2">
                <Col md={3}>
                    <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <FloatingLabel label="Usuário">
                            <FormControl type="text" />
                        </FloatingLabel>
                    </InputGroup>
                </Col>
            </Row>
            <Row className="mb-2">
                <Col md={3}>
                    <InputGroup>
                        <FloatingLabel label="Senha">
                            <FormControl type="password" />
                        </FloatingLabel>
                        <InputGroup.Text>
                            olho
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
        </>
    )
}

export default function LoginPage() {
    return (
        <Container fluid>
            <Stack>
                <h1>Bem vindo de volta!</h1>
            </Stack>
            <LoginForm />
        </Container>
    )
}