import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import SearchContainer from "../components/SearchContainer";
import usePost from "../hooks/use-post";
import { GridPostProps, ProfilePostsProps } from "../types/types";
import UserPosts from "../components/UserPosts";
import useUser from "../hooks/use-user";
import ProfileInformation from "../components/ProfileInformation";

type SearchFilterProps = {
    name: string;
    onClick: () => void;
}

function SearchFilter({ name, onClick }: SearchFilterProps) {
    return (
        <Col
            className="text-center"
            md={6}
            onClick={onClick}>
            {name}
        </Col>
    );
}

function SearchResults() {
    const location = useLocation();
    const { getByContent } = usePost();
    const { searchAllByUsername } = useUser();

    const [posts, setPosts] = useState<GridPostProps[] | []>([]);
    const [users, setUsers] = useState<ProfilePostsProps[]>([]);
    const [showPosts, setShowPosts] = useState<boolean>(true);

    useEffect(() => {
        if (!location) return;

        getByContent(location.state)
            .then(res => {
                setPosts(res.data.posts);
            });

        searchAllByUsername(location.state)
            .then(res => {
                setUsers(res.data)
            })

    }, [location]);

    useEffect(() => {

    }, [showPosts]);

    const toggleView = () => {
        setShowPosts(!showPosts);
    }

    return (
        <>
            <Row className="mt-1">
                <SearchFilter name="Publicações" onClick={toggleView} />
                <SearchFilter name="Usuários" onClick={toggleView} />
            </Row>
            <Row className="mt-4">
                {showPosts ? (<UserPosts posts={posts} />) : (<div className="d-flex flex-column gap-3">{users.map(u => (<ProfileInformation userProfile={u} />))}</div>)}
            </Row>
        </>
    )
}

function SearchResultsContainer() {
    const location = useLocation();

    return (
        <Col md={6}>
            <SearchContainer defaultValue={location.state} />
            <SearchResults />
        </Col>
    )
}

export default function SearchPage() {
    return (
        <Container fluid>
            <Row>
                <LeftColumn />
                <SearchResultsContainer />
            </Row>
        </Container>
    )
}