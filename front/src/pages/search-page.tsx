import { Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import LeftColumn from "../components/LeftColumn";
import SearchContainer from "../components/SearchContainer";


function SearchResults() {
    const location = useLocation();

    console.log(location.state);


    return (
        <Col md={6}>
            <SearchContainer defaultValue={location.state} />
        </Col>
    )
}

export default function SearchPage() {
    return (
        <Container fluid>
            <Row>
                <LeftColumn />
                <SearchResults />
            </Row>
        </Container>
    )
}