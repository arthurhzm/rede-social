import { Col } from "react-bootstrap";
import SearchContainer from "./SearchContainer";

export default function RightColumn() {

    return (
        <Col md={3}>
            <SearchContainer />
        </Col>
    )
}