import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown, FormControl, Row } from "react-bootstrap";
import { useToast } from "../contexts/ToastContext";
import { formatDate } from "../functions/utils";
import usePost from "../hooks/use-post";
import { GridPostProps } from "../types/types";

function LeftColumn() {
    return (
        <Col md={3}>
            <h1>Left Column</h1>
        </Col>
    )
}


type ExpandingTextareaProps = {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

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

function PostsOptions() {
    return (
        <Row>
            <Col md={6}>
                <Button>Para você</Button>
            </Col>
            <Col md={6}>
                <Button>Seguindo</Button>
            </Col>
        </Row>
    )
}

function PostContainer() {
    const [content, setContent] = useState<string>('');
    const { createPost } = usePost();
    const { showSuccess } = useToast()

    const makePost = async () => {
        if (content === '') return;
        await createPost({ content });
        showSuccess("Publicação realizada com sucesso!");
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

    const { fetchAllPosts, updatePost } = usePost();
    const { showSuccess } = useToast();
    const [posts, setPosts] = useState<GridPostProps[]>([]);
    const [userSession, setUserSession] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetchAllPosts();
            const { userId, posts } = res.data
            setPosts(posts);
            setUserSession(userId);
        };

        fetchPosts();
    }, []);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        setContent("");
    }

    const handleDeletePost = (postId: number) => {
        setPosts(posts.filter(post => post.id !== postId));
        toggleEdit();
    }

    const handleSaveChanges = async (post: GridPostProps) => {
        if (post.content === content) {
            toggleEdit();
            return
        }

        if (content === '') {
            handleDeletePost(post.id);
        }

        await updatePost({ content, id: post.id });
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
                            @{post.user.username}
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
                                        <Settings size={20}/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => { setIsEditing(true); setContent(post.content) }}>Editar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDeletePost(post.id)}>Excluir</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            {isEditing ? (
                                <ExpandingTextarea
                                    content={content}
                                    setContent={setContent} />
                            ) : (<span>{post.content}</span>)}
                        </Col>
                        {isEditing && (
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
            <PostsOptions />
            <PostContainer />
            <Posts />
        </Col>
    )
}

function RightColumn() {
    return (
        <Col md={3}>
            <h1>Right Column</h1>
        </Col>
    )
}


export default function Main() {
    return (
        <Row>
            <LeftColumn />
            <MainColumn />
            <RightColumn />
        </Row>
    )
}