import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown, FormControl, Row } from "react-bootstrap";
import { useToast } from "../contexts/ToastContext";
import { formatDate } from "../functions/utils";
import usePost from "../hooks/use-post";
import { GridPostProps } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { addPost, removePost, setPosts, updatePost } from "../store/slices/postsSlice";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { PATH } from "../routes/routes";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import { setUserId } from "../store/slices/authSlice";

function ExpandingTextarea({ content, setContent }: ExpandingTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = textareaRef.current;
        setContent(event.currentTarget.value);

        if (!textarea) return;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    return (
        <Col>
            <FormControl
                as="textarea"
                ref={textareaRef}
                onInput={handleInput}
                placeholder="No que você está pensando?"
                rows={1}
                value={content}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                }}
            />
        </Col>
    );
}

function PostContainer() {
    const { createPost } = usePost();
    const { showSuccess } = useToast();
    const dispatch = useDispatch();

    const [content, setContent] = useState<string>('');

    const makePost = async () => {
        if (content === '') return;
        const res = await createPost({ content });
        showSuccess("Publicação realizada com sucesso!");
        dispatch(addPost(res));
        setContent('');
    }

    return (
        <>
            <Row>
                <Col md={"auto"}>
                    <small>Foto de perfil</small>
                </Col>
                <ExpandingTextarea
                    content={content}
                    setContent={setContent} />
            </Row>
            <Row>
                <Col md={12}>
                    <Button
                        type="button"
                        disabled={content === ''}
                        onClick={makePost}>Publicar</Button>
                </Col>
            </Row>
        </>
    )

}

function Posts() {

    const { fetchAllPosts, patchPost, deletePost } = usePost();
    const { showSuccess } = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userSession, setUserSession] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean | number>(false);
    const [content, setContent] = useState<string>('');
    const posts = useSelector((state: RootState) => state.posts.posts);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetchAllPosts();
            const { userId, posts } = res.data
            dispatch(setPosts(posts));
            setUserSession(userId);
            dispatch(setUserId(userId));
        };

        fetchPosts();
    }, []);

    const handleProfileClick = (username: string) => {
        navigate(PATH.profile + '/' + username);
    }

    const toggleEdit = () => {
        setIsEditing(false);
        setContent("");
    }

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
        }

        await patchPost({ content, id: post.id });
        dispatch(updatePost({ content, id: post.id }));
        showSuccess("Publicação editada com sucesso");

        toggleEdit();
    }

    const handleDiscardChanges = () => {
        toggleEdit()
    }

    return (
        <>
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
            ))
            }
        </>
    )
}

function MainColumn() {
    return (
        <Col md={6}>
            <PostContainer />
            <Posts />
        </Col>
    )
}


export default function MainPage() {
    return (
        <Row>
            <LeftColumn />
            <MainColumn />
            <RightColumn />
        </Row>
    )
}

type ExpandingTextareaProps = {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}