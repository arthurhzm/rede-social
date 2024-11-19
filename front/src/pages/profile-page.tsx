import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import UserPosts from "../components/UserPosts";
import { useToast } from "../contexts/ToastContext";
import usePost from "../hooks/use-post";
import useProfile from "../hooks/use-profile";
import useUser from "../hooks/use-user";
import { removePost, updatePost } from "../store/slices/postsSlice";
import { RootState } from "../store/store";
import { GridPostProps, ProfilePostsProps } from "../types/types";

type PostsProps = {
    profile: ProfilePostsProps
}

function ProfilePosts({ profile }: PostsProps) {
    const { showSuccess } = useToast();
    const dispatch = useDispatch();
    const { deletePost, patchPost } = usePost();

    const [isEditing, setIsEditing] = useState<boolean | number>(false);
    const [content, setContent] = useState<string>("");
    const [posts, setPosts] = useState<GridPostProps[]>(profile.posts);

    const toggleEdit = () => {
        setIsEditing(false);
        setContent("");
    }

    const handleDeletePost = async (postId: number) => {
        dispatch(removePost(postId));
        await deletePost(postId);
        showSuccess("Publicação excluída com sucesso");
        setPosts(profile.posts.filter(post => post.id !== postId));
    }

    const handleSaveChanges = async (post: GridPostProps) => {
        if (post.content === content) {
            toggleEdit();
            return;
        }

        if (content === '') {
            handleDeletePost(post.id);
            return;
        }

        await patchPost({ content, id: post.id });
        dispatch(updatePost({ content, id: post.id }));
        showSuccess("Publicação editada com sucesso");

        setPosts(posts.map(p => p.id === post.id ? { ...p, content } : p));
        toggleEdit();
    }


    return (
        <UserPosts
            handleDeletePost={handleDeletePost}
            handleSaveChanges={handleSaveChanges}
            content={content}
            setContent={setContent}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            posts={posts} />
    )
}

function MainColumn() {
    const { username } = useParams<{ username: string }>();
    const { getByUsername } = useUser();
    const { followUser, getFollowers, unfollowUser } = useProfile();
    const { showSuccess } = useToast()
    const userId = useSelector((state: RootState) => state.auth.userId);

    const [profile, setProfile] = useState<ProfilePostsProps | null>(null);
    const [followers, setFollowers] = useState<ProfilePostsProps[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            const res = await getByUsername(username);
            setProfile(res.data);
        }

        fetchProfile();
    }, [username]);

    useEffect(() => {
        if (!profile) return;

        const fetchFollowers = async () => {
            const res = await getFollowers(profile.id);
            setFollowers(res.data);
            setIsFollowing(res.data.some((follower: ProfilePostsProps) => follower.id === userId));
            setLoading(false);
        }

        fetchFollowers();

    }, [profile]);

    const toggleFollow = async () => {
        if (!profile) return;

        try {
            if (isFollowing) {
                await unfollowUser(profile.id);
            } else {
                await followUser(profile.id);
            }

            const message = isFollowing ? "Você deixou de seguir " : "Agora você está seguindo ";
            showSuccess(message + profile.username);
            setProfile({ ...profile, followers: isFollowing ? profile.followers - 1 : profile.followers + 1 });
        } catch (error) {
            console.log(error);
        }
    }

    const profileFollowers = () => {
        console.log(followers);
    }

    if (loading) return <h1>Carregando...</h1>;

    return (
        <Col md={6}>
            <Row>
                <Col>
                    foto de capa
                </Col>
            </Row>
            <Row>
                <Col md={"auto"}>Foto de perfil</Col>
                <Col className="d-flex gap-2">
                    <span>@{username}</span>
                    <span onClick={profileFollowers}>{profile?.followers} seguidores</span>
                    {profile && userId == profile.id && <button>Editar perfil</button>}
                    {profile && userId != profile.id && <Button onClick={toggleFollow}>{isFollowing ? 'Seguindo' : 'Seguir'}</Button>}
                </Col>
            </Row>
            {profile && (<ProfilePosts profile={profile} />)}
        </Col>
    )
}

export default function ProfilePage() {

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