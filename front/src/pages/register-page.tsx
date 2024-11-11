import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button, Col, Container, FloatingLabel, FormControl, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATH } from "../routes/routes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import InputText from "../components/InputText";


function RegisterForm() {

    const navigate = useNavigate();
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

    const schema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    }).refine(data => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

    const { register, handleSubmit, formState } = useForm();


    return (
        <form>
            <Row>
                <Col>
                    <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <InputText
                            label="Usuário"
                            type="text" />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        label="E-mail"
                        type="email" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup>
                        <InputText
                            label="Senha"
                            type={viewPassword ? "text" : "password"} />
                        <InputGroup.Text onClick={() => setViewPassword(!viewPassword)}>
                            {viewPassword ? <EyeOff /> : <Eye />}
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col>
                    <InputGroup>
                        <InputText
                            label="Confirmar senha"
                            type={viewConfirmPassword ? "text" : "password"} />
                        <InputGroup.Text onClick={() => setViewConfirmPassword(!viewConfirmPassword)}>
                            {viewPassword ? <EyeOff /> : <Eye />}
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
                    onClick={() => navigate(PATH.login)}>
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