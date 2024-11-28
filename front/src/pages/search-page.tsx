import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import ProfileInformation from "../components/ProfileInformation";
import SearchContainer from "../components/SearchContainer";
import UserPosts from "../components/UserPosts";
import useUser from "../hooks/use-user";
import { RootState } from "../store/store";
import { ProfilePostsProps } from "../types/types";

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
    const { searchAllByUsername } = useUser();

    const posts = useSelector((state: RootState) => state.posts.posts)
        .filter(post => post.content && post.content.includes(location.state));

    const [users, setUsers] = useState<ProfilePostsProps[]>([]);
    const [showPosts, setShowPosts] = useState<boolean>(true);

    useEffect(() => {
        if (!location) return;

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
                {showPosts ? (<UserPosts posts={posts} />) : (<div className="d-flex flex-column gap-3">{users.map(u => (<ProfileInformation userProfile={u} key={u.id} />))}</div>)}
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