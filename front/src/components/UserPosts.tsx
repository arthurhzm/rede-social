import { Heart, HeartOff, MessageCircle, Settings } from "lucide-react";
import { Button, Col, Dropdown, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../functions/utils";
import usePost from "../hooks/use-post";
import { PATH } from "../routes/routes";
import { RootState } from "../store/store";
import { GridPostProps } from "../types/types";
import ExpandingTextarea from "./ExpandingTextarea";
import { setPosts } from "../store/slices/postsSlice";
import { useState } from "react";

type CommentsModalProps = {
    post: GridPostProps | null;
    show: boolean;
    onHide: () => void;
}

function CommentsModal({ post, show, onHide }: CommentsModalProps) {

    if (!post) return null;

    return (
        <Modal
            onHide={onHide}
            show={show}
            size="lg"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Comentários</Modal.Title>
            </Modal.Header>
        </Modal>
    )
}


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
    const { likePost, unlikePost } = usePost();
    const dispatch = useDispatch();
    const [showComments, setShowComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState<GridPostProps | null>(null);

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

    const toggleLikePost = async (post: GridPostProps) => {
        const updatedPosts = posts.map(p => {
            if (p.id === post.id) {
                if (p.likes.some(l => l.userId === userSession)) {
                    unlikePost(post.id);
                    return {
                        ...p,
                        likes: p.likes.filter(l => l.userId !== userSession),
                    };
                } else {
                    likePost(post.id);
                    return {
                        ...p,
                        likes: [...p.likes, { userId: userSession }],
                    };
                }
            }
            return p;
        });

        dispatch(setPosts(updatedPosts));
    };

    const handleOpenComments = (post: GridPostProps) => {
        setSelectedPost(post);
        setShowComments(true);
    };

    const handleCloseComments = () => {
        setShowComments(false);
        setSelectedPost(null);
    };

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
                        <Col
                            md={"auto"}
                            onClick={() => toggleLikePost(post)}>
                            {post.likes.some(l => l.userId == userSession) ? <HeartOff className="text-danger" /> : <Heart className="text-danger" />} <b>{post.likes.length}</b>
                        </Col>
                        <Col
                            md={"auto"}
                            onClick={() => { handleOpenComments(post); }}>
                            <MessageCircle />
                        </Col>
                    </Row>
                </div>
            ))}
            <CommentsModal
                post={selectedPost}
                show={showComments}
                onHide={handleCloseComments} />
        </div>
    )
}