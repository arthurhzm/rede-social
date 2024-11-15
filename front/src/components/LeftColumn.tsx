import { DoorOpen } from "lucide-react";
import { Button, Col } from "react-bootstrap";
import useUser from "../hooks/use-user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { PATH } from "../routes/routes";

export default function LeftColumn() {

    const { logoutUser } = useUser();
    const navigate = useNavigate();
    const { removeToken } = useAuth();

    const handleLogout = async () => {
        try {
            await logoutUser();
            removeToken();
            navigate(PATH.login);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Col md={3}>
            <div>
                <Button
                    variant="outline-dark"
                    onClick={handleLogout}>
                    <DoorOpen /> Sair
                </Button>
            </div>
        </Col>
    )
}