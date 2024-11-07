import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button, Col, Container, FloatingLabel, FormControl, InputGroup, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Path from "../routes/routes";

function LoginForm() {
    const navigate = useNavigate();
    const [viewPassword, setViewPassword] = useState(false);

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
                            <FormControl type={viewPassword ? "text" : "password"} />
                        </FloatingLabel>
                        <InputGroup.Text onClick={() => setViewPassword(!viewPassword)}>
                            {viewPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
            <div>
                <Button variant="outline-dark">
                    Entrar
                </Button>
            </div>
            <div>ou</div>
            <div>
                <Button
                    variant="outline-dark"
                    onClick={() => navigate(Path.REGISTER)}>
                    Criar uma conta
                </Button>
            </div>
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