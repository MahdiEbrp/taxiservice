import React, { useState } from 'react';
import { IconButton, InputAdornment, StandardTextFieldProps, TextField } from '@mui/material';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
export interface PasswordProps extends StandardTextFieldProps {
}
const PasswordField = (props: PasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);
    /* #region Functions section */
    const handleClick = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    /* #endregion */
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