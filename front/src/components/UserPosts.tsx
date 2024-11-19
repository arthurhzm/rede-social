import { Settings } from "lucide-react";
import { Button, Col, Dropdown, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../functions/utils";
import { PATH } from "../routes/routes";
import { RootState } from "../store/store";
import { GridPostProps } from "../types/types";
import ExpandingTextarea from "./ExpandingTextarea";

type UserPostsProps = {
    posts: GridPostProps[],
    handleDeletePost: (postId: number) => void;
    handleSaveChanges: (post: GridPostProps) => void;
    content: string;
    setContent: (content: string) => void;
    isEditing: boolean | number;
    setIsEditing: (isEditing: boolean | number) => void;
};


export default function UserPosts({ posts, handleDeletePost, handleSaveChanges, content, setContent, isEditing, setIsEditing }: UserPostsProps) {
    const navigate = useNavigate();
    const userSession = useSelector((state: RootState) => state.auth.userId);

    const handleProfileClick = (username: string) => {
        navigate(PATH.profile + '/' + username);
    }

    const handleDiscardChanges = () => {
        toggleEdit()
    }

    const toggleEdit = () => {
        setIsEditing(false);
        setContent("");
    }

    return (
        <div>
            {!!posts.length && posts.map((post) => (
                <div key={post.id}>
                    <Row>
                        <Col md={9}>
                            <div onClick={() => handleProfileClick(post.user.username)}>
                                foto de perfil
                                @{post.user.username}
                            </div>
                        </Col>
                        <Col>
                            {formatDate(post.createdAt, 'BR')}
                        </Col>
                        <Col md={"auto"}>
                            {userSession === post.userId && (
                                <Dropdown>
                                    <Dropdown.Toggle
                                        size="sm"
                                        variant="outline-dark"
                                        disabled={!!isEditing}>
                                        <Settings size={20} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => { setIsEditing(post.id); setContent(post.content) }}>Editar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDeletePost(post.id)}>Excluir</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            {isEditing === post.id ? (
                                <ExpandingTextarea
                                    content={content}
                                    setContent={setContent} />
                            ) : (<span>{post.content}</span>)}
                        </Col>
                        {isEditing === post.id && (
                            <Col className="text-end mt-2">
                                <Button
                                    variant="outline-success"
                                    onClick={() => handleSaveChanges(post)}>
                                    Editar
                                </Button>
                                <Button
                                    className="ms-2"
                                    variant="outline-danger"
                                    onClick={handleDiscardChanges}>
                                    Descartar
                                </Button>
                            </Col>
                        )}
                    </Row>
                    <Row>

                    </Row>
                </div >
            ))}
        </div>
    )
}