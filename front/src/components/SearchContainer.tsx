import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../routes/routes";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { Search } from "lucide-react";

type SearchContainerProps = {
    defaultValue?: string;
}

export default function SearchContainer({ defaultValue }: SearchContainerProps) {

    const navigate = useNavigate();
    const [search, setSearch] = useState<string>(defaultValue || "");

    const handleSearch = () => {
        if (search.length === 0) return;
        navigate(PATH.search, { state: search });
    }

    return (
        <InputGroup>
            <FormControl
                placeholder="O que deseja pesquisar?"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                onKeyUp={(e) => {
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
    )
}