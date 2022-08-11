import TextField, { TextFieldProps } from '@mui/material/TextField';
import React, { ElementType } from 'react';
export interface ForcedPatternInputProps {
    pattern: RegExp;
}
const ForcedPatternInput: ElementType<TextFieldProps | ForcedPatternInputProps> = (props: ForcedPatternInputProps | TextFieldProps) => {
    let prevValue = '';
    const { pattern } = props as ForcedPatternInputProps;
    const {...others} = props as TextFieldProps;
    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        if (value === '') {
            prevValue = '';
            return;
        }
        if (!pattern.test(value))
            event.target.value = prevValue;
        else
            prevValue = value;
    };
    return (
        <>
            <TextField onChange={(event) => onChange(event)}  {...others} />
        </>
    );
};

export default ForcedPatternInput;