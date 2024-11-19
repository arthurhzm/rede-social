import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ExpandingTextarea from "../components/ExpandingTextarea";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import UserPosts from "../components/UserPosts";
import { useToast } from "../contexts/ToastContext";
import usePost from "../hooks/use-post";
import { setUserId } from "../store/slices/authSlice";
import { addPost, removePost, setPosts, updatePost } from "../store/slices/postsSlice";
import { RootState } from "../store/store";
import { GridPostProps } from "../types/types";

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

    const [userSession, setUserSession] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean | number>(false);
    const [content, setContent] = useState<string>('');
    const posts = useSelector((state: RootState) => state.posts.posts);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetchAllPosts();
            const { userId, posts } = res.data;
            dispatch(setPosts(posts));
            setUserSession(userId);
            dispatch(setUserId(userId));
        };

        fetchPosts();
    }, []);


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
            return;
        }

        await patchPost({ content, id: post.id });
        dispatch(updatePost({ content, id: post.id }));
        showSuccess("Publicação editada com sucesso");

        toggleEdit();
    }

    return (
        <UserPosts
            handleDeletePost={handleDeletePost}
            handleSaveChanges={handleSaveChanges}
            posts={posts}
            content={content}
            setContent={setContent}
            isEditing={isEditing}
            setIsEditing={setIsEditing} />
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
        <Container fluid>
            <Row>
                <LeftColumn />
                <MainColumn />
                <RightColumn />
            </Row>
        </Container>
    )
}
