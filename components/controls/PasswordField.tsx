import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react';
import TextField, { StandardTextFieldProps } from '@mui/material/TextField';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';

const PasswordField = (props: StandardTextFieldProps) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleClick = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const { ...other } = props;
    return (
        <TextField {...other} type={showPassword ? 'text' : 'password'}
            InputProps={{
                endAdornment:
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClick}
                            onMouseDown={handleMouseDown}>
                            {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
                        </IconButton>
                    </InputAdornment>
            }}
        />

    );
};

export default PasswordField;