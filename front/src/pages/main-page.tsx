import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ExpandingTextarea from "../components/ExpandingTextarea";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import UserPosts from "../components/UserPosts";
import { useToast } from "../contexts/ToastContext";
import usePost from "../hooks/use-post";
import { PATH } from "../routes/routes";
import { setUserId } from "../store/slices/authSlice";
import { addPost, setPosts } from "../store/slices/postsSlice";
import { RootState } from "../store/store";

function PostContainer() {
    const { createPost } = usePost();
    const { showSuccess } = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const posts = useSelector((state: RootState) => state.posts.posts);
    const userId = useSelector((state: RootState) => state.auth.userId);
    const username = posts.find(p => p.userId == userId)?.user.username;


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
                <Col
                    md={"auto"}
                    onClick={() => navigate(PATH.profile + '/' + username)}>
                    <User />
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

    const { fetchAllPosts } = usePost();
    const dispatch = useDispatch();

    const [userSession, setUserSession] = useState<number>(0);
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


    return (<UserPosts posts={posts} />)
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
