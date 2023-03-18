import TextField, { TextFieldProps } from '@mui/material/TextField';
import React, { ElementType } from 'react';

export type ForcedPatternInputProps = {
    pattern: RegExp;
};

const ForcedPatternInput: ElementType<TextFieldProps | ForcedPatternInputProps> = (props: ForcedPatternInputProps | TextFieldProps) => {

    let previousValue = '';

    const { pattern } = props as ForcedPatternInputProps;
    const { ...others } = props as TextFieldProps;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { value } = event.target;

        if (value === '') {
            previousValue = '';
            return;
        }
        if (!pattern.test(value))
            event.target.value = previousValue;
        else
            previousValue = value;
    };

    return (
        <>
            <TextField onChange={(event) => onChange(event)}  {...others} />
        </>
    );
};

export default ForcedPatternInput;