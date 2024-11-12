import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button, Col, Container, InputGroup, Row, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import InputText from "../components/InputText";
import { PATH } from "../routes/routes";
import useUser from "../hooks/use-user";
import { useAuth } from "../contexts/AuthContext";

function LoginForm() {
    const navigate = useNavigate();
    const { authenticateUser } = useUser();
    const { setToken } = useAuth();
    const [viewPassword, setViewPassword] = useState(false);

    const schema = z.object({
        username: z.string().min(3, { message: "Informe um usuário com pelo menos 3 caracteres" }),
        password: z.string().min(6, { message: "Informe uma senha com pelo menos 6 caracteres" }),
    });

    type LoginFormType = z.infer<typeof schema>;

    const { register, handleSubmit, formState } = useForm<LoginFormType>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: LoginFormType) => {
        const response = await authenticateUser(data);
        const { token } = response.data;
        setToken(token);
        navigate(PATH.home);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-2">
                <Col md={3}>
                    <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <InputText
                            type="text"
                            label="Usuário"
                            {...register("username")}
                            errors={formState.errors.username} />
                    </InputGroup>
                </Col>
            </Row>
            <Row className="mb-2">
                <Col md={3}>
                    <InputGroup>
                        <InputText
                            type={viewPassword ? "text" : "password"}
                            label="Senha"
                            {...register("password")}
                            errors={formState.errors.password} />
                        <InputGroup.Text onClick={() => setViewPassword(!viewPassword)}>
                            {viewPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
            <div>
                <Button
                    type="submit"
                    variant="outline-dark">
                    Entrar
                </Button>
            </div>
            <div>ou</div>
            <div>
                <Button
                    type="button"
                    variant="outline-dark"
                    onClick={() => navigate(PATH.register)}>
                    Criar uma conta
                </Button>
            </div>
        </form>
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