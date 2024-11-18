import { useRef } from "react";
import { Col, FormControl } from "react-bootstrap";

type ExpandingTextareaProps = {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function ExpandingTextarea({ content, setContent }: ExpandingTextareaProps) {
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