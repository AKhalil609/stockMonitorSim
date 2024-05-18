import { type ChangeEvent } from "react";
import './style.scss';

interface TextFieldProps {
    value?: string;
    placeholder?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextField = ({ value, placeholder, onChange }: TextFieldProps) => {
    return (
        <input
            type="text"
            className="textField"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};

export default TextField;
