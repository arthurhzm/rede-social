import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button, Col, Container, InputGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import InputText from "../components/InputText";
import { PATH } from "../routes/routes";
import useUser from "../hooks/use-user";
import { useToast } from "../contexts/ToastContext";


function RegisterForm() {

    const navigate = useNavigate();
    const { createUser } = useUser();
    const { showSuccess } = useToast()
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

    const schema = z.object({
        username: z.string().min(3, { message: "Informe um usuário com pelo menos 3 caracteres" }),
        email: z.string().email({ message: "Informe um e-mail válido" }),
        password: z.string().min(6, { message: "Informe uma senha com pelo menos 6 caracteres" }),
        confirmPassword: z.string().min(6, { message: "Informe uma senha com pelo menos 6 caracteres" }),
    }).refine(data => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

    type RegisterFormData = z.infer<typeof schema>;

    const { register, handleSubmit, formState } = useForm<RegisterFormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: RegisterFormData) => {
        await createUser(data);
        showSuccess("Usuário cadastrado com sucesso");
        navigate(PATH.login);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col>
                    <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <InputText
                            label="Usuário"
                            type="text"
                            {...register("username")}
                            errors={formState.errors.username} />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        label="E-mail"
                        type="email"
                        {...register("email")}
                        errors={formState.errors.email} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup>
                        <InputText
                            label="Senha"
                            type={viewPassword ? "text" : "password"}
                            {...register("password")}
                            errors={formState.errors.password} />
                        <InputGroup.Text onClick={() => setViewPassword(!viewPassword)}>
                            {viewPassword ? <EyeOff /> : <Eye />}
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col>
                    <InputGroup>
                        <InputText
                            label="Confirmar senha"
                            type={viewConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            errors={formState.errors.confirmPassword} />
                        <InputGroup.Text onClick={() => setViewConfirmPassword(!viewConfirmPassword)}>
                            {viewPassword ? <EyeOff /> : <Eye />}
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
            <div>
                <Button
                    type="submit"
                    variant="outline-dark">
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