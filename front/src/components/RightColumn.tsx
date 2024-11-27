import { Search } from "lucide-react";
import { useState } from "react";
import { Button, Col, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function RightColumn() {

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleSearch = () => {
        if (search.length === 0) return;
        console.log(search);

    }

    return (
        <Col md={3}>
            <InputGroup>
                <FormControl
                    placeholder="O que deseja pesquisar?"
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }} />

                <Button
                    onClick={handleSearch}
                    className="bg-transparent btn-light">
                    <Search />
                </Button>
            </InputGroup>
        </Col>
    )
}