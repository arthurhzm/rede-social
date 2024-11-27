import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import SearchContainer from "../components/SearchContainer";

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

    useEffect(() => {
        if (!location) return;

        // adicionar a lógica para pesquisar posts e usuários

    }, [location])

    const handlePostsClick = () => {

    }

    const handleUsersClick = () => {

    }

    return (
        <Row className="mt-1">
            <SearchFilter name="Publicações" onClick={handlePostsClick} />
            <SearchFilter name="Usuários" onClick={handleUsersClick} />
        </Row>
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