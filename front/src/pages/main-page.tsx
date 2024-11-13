import { useRef, useState } from "react";
import { Button, Col, FormControl, Row } from "react-bootstrap"
import usePost from "../hooks/use-post";
import { useToast } from "../contexts/ToastContext";

function LeftColumn() {
    return (
        <Col md={3}>
            <h1>Left Column</h1>
        </Col>
    )
}


function ExpandingTextarea({ content, setContent }: { content: string; setContent: React.Dispatch<React.SetStateAction<string>> }) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = textareaRef.current;
        setContent(event.currentTarget.value);

        if (!textarea) return;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    return (
        <Col>
            <FormControl
                as="textarea"
                ref={textareaRef}
                onInput={handleInput}
                placeholder="No que você está pensando?"
                rows={1}
                value={content}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                }}
            />
        </Col>
    );
}

function PublishContainer() {
    const [content, setContent] = useState<string>('');
    const { createPost } = usePost();
    const { showSuccess } = useToast()

    const makePost = async () => {
        if (content === '') return;
        await createPost({ content });
        showSuccess("Publicação realizada com sucesso!");
        setContent('');
    }

    return (
        <>
            <Row>
                <Col md={"auto"}>
                    <small>Foto de perfil</small>
                </Col>
                <ExpandingTextarea
                    content={content}
                    setContent={setContent} />
            </Row>
            <Row>
                <Col md={12}>
                    <Button
                        type="button"
                        disabled={content === ''}
                        onClick={makePost}>Publicar</Button>
                </Col>
            </Row>
        </>
    )

}

function MainColumn() {
    return (
        <Col md={6}>
            <Row>
                <Col md={6}>
                    <Button>Para você</Button>
                </Col>
                <Col md={6}>
                    <Button>Seguindo</Button>
                </Col>
            </Row>
            <PublishContainer />
        </Col>
    )
}

function RightColumn() {
    return (
        <Col md={3}>
            <h1>Right Column</h1>
        </Col>
    )
}


export default function Main() {
    return (
        <Row>
            <LeftColumn />
            <MainColumn />
            <RightColumn />
        </Row>
    )
}