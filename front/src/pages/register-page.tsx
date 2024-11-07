import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button, Col, Container, FloatingLabel, FormControl, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Path from "../routes/routes";

function RegisterForm() {

    const navigate = useNavigate();
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

    return (
        <form>
            <Row>
                <Col>
                    <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <FloatingLabel label="Usuário">
                            <FormControl type="text" />
                        </FloatingLabel>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FloatingLabel label="Email">
                        <FormControl type="email" />
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup>
                        <FloatingLabel label="Senha">
                            <FormControl type={viewPassword ? "text" : "password"} />
                        </FloatingLabel>
                        <InputGroup.Text onClick={() => setViewPassword(!viewPassword)}>
                            {viewPassword ? <EyeOff /> : <Eye />}
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup>
                        <FloatingLabel label="Senha">
                            <FormControl type={viewConfirmPassword ? "text" : "password"} />
                        </FloatingLabel>
                        <InputGroup.Text onClick={() => setViewConfirmPassword(!viewConfirmPassword)}>
                            {viewConfirmPassword ? <EyeOff /> : <Eye />}
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
            <div>
                <Button variant="outline-dark">
                    Criar conta
                </Button>
            </div>
            <div>
                ou
            </div>
            <div>
                <Button
                    type="button"
                    variant="outline-dark"
                    onClick={() => navigate(Path.LOGIN)}>
                    Entrar
                </Button>
            </div>
        </form>
    )
}

export default function RegisterPage() {
    return (
        <Container fluid>
            <h1>Registre-se</h1>
            <RegisterForm />
        </Container>
    )
}