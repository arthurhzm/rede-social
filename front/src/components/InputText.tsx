import React from 'react';
import { FloatingLabel } from 'react-bootstrap';
import { FieldError } from "react-hook-form";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type: React.HTMLInputTypeAttribute;
    errors?: FieldError;
}

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
    ({ label, type, errors, ...props }, ref) => {
        return (
            <div>
                <FloatingLabel label={label} >
                    <input
                        className='form-control form-control-sm'
                        ref={ref}
                        type={type}
                        {...props}
                    />
                    {errors && <span>{errors.message}</span>}
                </FloatingLabel>
            </div>
        );
    }
);

export default InputText;
