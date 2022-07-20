import { Box,CircularProgress } from '@mui/material';

const CircularLoading = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <CircularProgress />
        </Box>
    );
};

export default CircularLoading;