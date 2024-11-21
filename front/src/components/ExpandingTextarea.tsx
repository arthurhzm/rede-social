import React, { useRef } from "react";
import { Col, FormControl } from "react-bootstrap";

interface ExpandingTextareaProps extends React.HtmlHTMLAttributes<HTMLTextAreaElement> {
    content: string;
    setContent: (content: string) => void;
    placeholder?: string;
    maxLength?: number;
}

export default function ExpandingTextarea({ content, setContent, placeholder, maxLength, ...props }: ExpandingTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                onChange={handleChange}
                placeholder={placeholder || "No que você está pensando?"}
                rows={1}
                value={content}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                }}
                maxLength={maxLength}
                {...props}
            />
        </Col>
    );
}