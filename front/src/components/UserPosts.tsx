import { Heart, HeartOff, MessageCircle, Send, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Col, Dropdown, InputGroup, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { formatDate } from "../functions/utils";
import useComment from "../hooks/use-comment";
import usePost from "../hooks/use-post";
import { PATH } from "../routes/routes";
import { removePost, setPosts, updatePost } from "../store/slices/postsSlice";
import { RootState } from "../store/store";
import { GridPostProps, PostCommentProps } from "../types/types";
import ExpandingTextarea from "./ExpandingTextarea";

type CommentsModalProps = {
    postId: number | undefined;
    show: boolean;
    onHide: () => void;
    onUpdatePost: (updatedPost: GridPostProps) => void;
}

function CommentsModal({ postId, show, onHide, onUpdatePost }: CommentsModalProps) {
    const { commentOnPost } = usePost();
    const { deleteComment, editComment } = useComment();
    const { showSuccess } = useToast();
    const navigate = useNavigate();
    const userSession = useSelector((state: RootState) => state.auth.userId);

    const [content, setContent] = useState("");
    const [editingContent, setEditingContent] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [isEditing, setIsEditing] = useState<boolean | number>(false);

    const post = useSelector((state: RootState) =>
        state.posts.posts.find(p => p.id === postId)
    );

    useEffect(() => {
        setContent("");
    }, [show]);

    useEffect(() => {
        setCharCount(content.length);
    }, [content]);

    if (!post) return null;

    const handleCommentPost = async () => {
        if (!content || content === '' || content.length > 125) return;
        const res = await commentOnPost({ content, id: post.id });
        const newComment = res.data;

        const updatedPost = {
            ...post,
            comments: [...post.comments, newComment]
        }

        onUpdatePost(updatedPost);

        showSuccess("Comentário realizado com sucesso");
        setContent("");
    }

    const handleEditComment = (comment: PostCommentProps) => {
        setEditingContent(comment.content);
        setIsEditing(comment.id);
    }

    const handleDeleteComment = async (id: number) => {
        await deleteComment(id);
        showSuccess("Comentário excluído com sucesso");
        const updatedPost = {
            ...post,
            comments: post.comments.filter(c => c.id !== id), // Remove o comentário
        };
        onUpdatePost(updatedPost);
    }

    const handleDiscardChanges = () => {
        setIsEditing(false);
        setEditingContent("");
    }

    const handleSaveChanges = async (comment: PostCommentProps) => {
        if (!editingContent || editingContent === '') {
            await handleDeleteComment(comment.id);
            return;
        }

        const res = await editComment({ id: comment.id, content: editingContent });
        const updatedComment = res.data;

        const updatedPost = {
            ...post,
            comments: post.comments.map(c =>
                c.id === updatedComment.id ? updatedComment : c
            )
        };

        onUpdatePost(updatedPost);

        setIsEditing(false);
        setEditingContent("");
        showSuccess("Comentário editado com sucesso");
    }

    return (
        <Modal
            onHide={onHide}
            show={show}
            size="lg"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Comentários</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {post.comments.length > 0 ? post.comments.map(comment => (
                        <div key={comment.id} className="mt-2">
                            <Row className="justify-content-between">
                                <Col>
                                    <div onClick={() => navigate(PATH.profile + '/' + comment.user.username)}>
                                        @{comment.user.username}
                                    </div>
                                </Col>
                                <Col md="auto">
                                    {comment.userId == userSession && (
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                size="sm"
                                                variant="outline-dark">
                                                <Settings size={20} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleEditComment(comment)}>Editar</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDeleteComment(comment.id)}>Excluir</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    {isEditing === comment.id ? (
                                        <ExpandingTextarea
                                            content={editingContent}
                                            setContent={setEditingContent} />
                                    ) : (
                                        <span style={{
                                            display: 'block',
                                            maxWidth: '700px',
                                            wordWrap: 'break-word',
                                            overflowWrap: 'break-word'
                                        }}>{comment.content}</span>)}
                                </Col>
                            </Row>
                            <Row>
                                {isEditing === comment.id && (
                                    <Col className="text-end mt-2">
                                        <Button
                                            variant="outline-success"
                                            onClick={() => handleSaveChanges(comment)}>
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
                        </div>
                    ))
                        :
                        <>
                            <Row>
                                <Col md={12} className="text-center">
                                    Nenhum comentário ainda, seja o primeiro a comentar!
                                </Col>
                            </Row>
                        </>}
                </Row>
                <Row className="mt-3">
                    <Col md={12}>
                        <InputGroup>
                            <ExpandingTextarea
                                placeholder="Escreva um comentário..."
                                content={content}
                                setContent={setContent}
                                maxLength={125}
                                disabled={!!isEditing}
                            />
                            <Button
                                variant="outline-dark"
                                onClick={handleCommentPost}
                                disabled={!!isEditing || content.length === 0}>
                                <Send />
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col className="text-end me-5">
                        <small>{charCount}/125</small>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal >
    )
}


type UserPostsProps = {
    posts: GridPostProps[]
};


export default function UserPosts({ posts }: UserPostsProps) {
    const navigate = useNavigate();
    const userSession = useSelector((state: RootState) => state.auth.userId);
    const { likePost, unlikePost, deletePost, patchPost } = usePost();
    const dispatch = useDispatch();
    const { showSuccess } = useToast();
    const [showComments, setShowComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState<GridPostProps | null>(null);
    const [content, setContent] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean | number>(false);


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

    const handleUpdatePostComments = (updatedPost: GridPostProps) => {
        const updatedPosts = posts.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        );
        dispatch(setPosts(updatedPosts)); // Atualiza o estado global (ou local se não usar Redux)
    };

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

    const handleDeletePost = async (postId: number) => {
        dispatch(removePost(postId));
        await deletePost(postId);
        showSuccess("Publicação excluída com sucesso");
    }

    const handleSaveChanges = async (post: GridPostProps) => {
        if (post.content === content) {
            toggleEdit();
            return
        }

        if (content === '') {
            handleDeletePost(post.id);
            return;
        }

        await patchPost({ content, id: post.id });
        dispatch(updatePost({ content, id: post.id }));
        showSuccess("Publicação editada com sucesso");

        toggleEdit();
    }

    return (
        <div>
            {!!posts.length && posts.map((post) => (
                <div key={post.id} className="mt-4">
                    <Row>
                        <Col md={9}>
                            <div
                                className="d-flex align-items-center"
                                onClick={() => handleProfileClick(post.user.username)}>
                                <User />
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
                            <MessageCircle /> <b>{post.comments.length}</b>
                        </Col>
                    </Row>
                </div>
            ))}
            <CommentsModal
                postId={selectedPost?.id}
                show={showComments}
                onHide={handleCloseComments}
                onUpdatePost={handleUpdatePostComments} />
        </div>
    )
}