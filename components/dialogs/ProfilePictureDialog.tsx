import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageLoader from '../controls/ImageLoader';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../context/LanguageContext';
import { useContext, useState, useMemo, useEffect } from 'react';

export type profilePictureProps = {
    isDialogOpen: boolean;
    onProfileChange: (profilePicture: string) => void;
    onClose: () => void;
};

const ProfilePictureDialog = (props: profilePictureProps) => {

    const { isDialogOpen, onProfileChange, onClose } = props;

    const [open, setOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');

    const { language } = useContext(LanguageContext);

    const { settings, profilePictureDialog } = language;

    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    const handleProfileChange = (profilePicture: string) => {
        setProfilePicture(profilePicture);
    };

    const images = useMemo(() => {
        return Array.from(Array(50).keys()).map((i) => `${process.env.NEXT_PUBLIC_WEB_URL}/images/profiles/profile${i}.svg`);
    }, []);

    const handleSave = () => {
        onProfileChange(profilePicture);
        handleClose();
    };
    useEffect(() => {
        setOpen(isDialogOpen);
    }, [isDialogOpen]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='imageList-dialog-title'
            aria-describedby='imageList-dialog-description'
            dir={settings.direction}
        >
            <DialogTitle id='imageList-dialog-title'>
                {profilePictureDialog.title}
            </DialogTitle>
            <DialogContent >
                <Typography id='imageList-dialog-description' sx={{margin:'2px',textAlign:'center'}}>
                    {profilePictureDialog.description}
                </Typography>
                <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                    {images.map((item) =>
                        <ImageListItem key={item} sx={{
                            opacity: item === profilePicture ? 1 : 0.8,
                            cursor: 'pointer',
                            transition: 'opacity 0.5s',
                            borderRadius: '2px',
                            backgroundColor: item === profilePicture ? 'background.paper' : 'transparent',
                            '&:hover': {
                                opacity: 1,
                            },
                        }}>
                            <ButtonBase component='span' onClick={() => handleProfileChange(item)}>
                                <ImageLoader src={item} alt={item} width={164} height={164} >
                                </ImageLoader>
                            </ButtonBase>
                        </ImageListItem>
                    )}
                </ImageList>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} autoFocus>{profilePictureDialog.save}</Button>
                <Button onClick={handleClose} autoFocus>{profilePictureDialog.discard}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfilePictureDialog;