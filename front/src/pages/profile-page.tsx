import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import ProfileInformation from "../components/ProfileInformation";
import RightColumn from "../components/RightColumn";
import UserPosts from "../components/UserPosts";
import useUser from "../hooks/use-user";
import { RootState } from "../store/store";
import { ProfilePostsProps } from "../types/types";

function ProfilePosts() {
    const userId = useSelector((state: RootState) => state.auth.userId);
    const posts = useSelector((state: RootState) => state.posts.posts).filter(post => post.userId == userId);

    return (<UserPosts posts={posts} />)
}

function MainColumn() {
    const { username } = useParams<{ username: string }>();
    const { getByUsername } = useUser();

    const [profile, setProfile] = useState<ProfilePostsProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            const res = await getByUsername(username);
            setProfile(res.data[0]);
            setLoading(false);
        }

        fetchProfile();
    }, [username]);

    if (loading) return <h1>Carregando...</h1>;

    return (
        <Col md={6}>
            <Row className="mb-1">
                <Col style={{ backgroundColor: '#383e47', height: '10rem' }}>
                </Col>
            </Row>
            {profile && (<ProfileInformation userProfile={profile} />)}
            {profile && (<ProfilePosts />)}
        </Col>
    )
}

export default function ProfilePage() {

    return (
        <Container fluid>
            <Row className="mt-1">
                <LeftColumn />
                <MainColumn />
                <RightColumn />
            </Row>
        </Container>
    )
}