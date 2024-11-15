import { DoorOpen } from "lucide-react";
import { Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useUser from "../hooks/use-user";
import { PATH } from "../routes/routes";
import { useDispatch } from "react-redux";
import { resetPosts } from "../store/slices/postsSlice";
import { resetUserId } from "../store/slices/authSlice";
import { persistor } from "../store/store";

export default function LeftColumn() {

    const { logoutUser } = useUser();
    const navigate = useNavigate();
    const { removeToken } = useAuth();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await logoutUser();
            removeToken();
            dispatch(resetUserId()); 
            dispatch(resetPosts());
            navigate(PATH.login);
            persistor.purge(); 
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