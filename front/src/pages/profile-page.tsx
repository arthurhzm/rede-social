import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ExpandingTextarea from "../components/ExpandingTextarea";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import { useToast } from "../contexts/ToastContext";
import { formatDate } from "../functions/utils";
import usePost from "../hooks/use-post";
import useProfile from "../hooks/use-profile";
import useUser from "../hooks/use-user";
import { PATH } from "../routes/routes";
import { removePost, updatePost } from "../store/slices/postsSlice";
import { RootState } from "../store/store";
import { BasePostsProps, ProfilePostsProps } from "../types/types";

type PostsProps = {
    profile: ProfilePostsProps
}

function ProfilePosts({ profile }: PostsProps) {
    const userSession = useSelector((state: RootState) => state.auth.userId);
    const navigate = useNavigate();
    const { showSuccess } = useToast();
    const dispatch = useDispatch();
    const { deletePost, patchPost } = usePost();

    const [isEditing, setIsEditing] = useState<boolean | number>(false);
    const [content, setContent] = useState<string>("");
    const [posts, setPosts] = useState<BasePostsProps[]>(profile.posts);

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
        setPosts(profile.posts.filter(post => post.id !== postId));
    }

    const handleSaveChanges = async (post: BasePostsProps) => {
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

    const handleDiscardChanges = () => {
        toggleEdit()
    }

    return (
        <div>
            {!!posts.length && posts.map((post) => (
                <div key={post.id}>
                    <Row>
                        <Col md={9}>
                            <div onClick={() => handleProfileClick(profile.username)}>
                                foto de perfil
                                @{profile.username}
                            </div>
                        </Col>
                        <Col>
                            {formatDate(post.createdAt, 'BR')}
                        </Col>
                        <Col md={"auto"}>
                            {userSession === profile.id && (
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