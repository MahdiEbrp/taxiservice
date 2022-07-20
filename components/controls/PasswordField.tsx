import { IconButton, InputAdornment, StandardTextFieldProps, TextField } from '@mui/material';
import React,{ useState } from 'react';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
export interface PasswordProps extends StandardTextFieldProps {
}

const PasswordField = (props: PasswordProps) => {
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