import Avatar from '@mui/material/Avatar';
import CenterBox from '../../controls/CenterBox';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../../context/LanguageContext';
import { postData } from '../../../lib/axiosRequest';
import Loader from '../../controls/Loader';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { PersonelContext } from '../../context/PersonelContext';
import Button from '@mui/material/Button';

const JobRequestTab = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const profilePictureUrl = publicUrl + '/images/profiles/';

    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);
    const { personelList, setPersonelList } = useContext(PersonelContext);
    const { personelManagementPage, notification } = language;

    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const [loadingText, setLoadingText] = useState<string>('');
    const handleToggle = (value: string) => () => {

        const currentIndex = checkedIds.indexOf(value);
        const newChecked = [...checkedIds];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setCheckedIds(newChecked);
    };
    const updateRequests = async () => {
        setLoadingText(personelManagementPage.acceptingRequests);
        const response = await postData('/api/personel/acceptPersonel', { ids: checkedIds });
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE',language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            const data = response.data as { ids: string[]; };
            if (data.ids.length > 0) {
                const newPersonelList = personelList?.map(personel => {
                    if (data.ids.includes(personel.id)) {
                        personel.isRequest = false;
                    }
                    return personel;
                });
                setPersonelList(newPersonelList);
            }
            setToast({ id: Math.random(), message: notification.successfullyAcceptPersonnel, alertColor: 'success' });
        }
        else {
            const data = response.data as { error: string; };
            if (data.error) {
                setToast({ id: Math.random(), message: getResponseError(data.error, language), alertColor: 'error' });
            }
            else {
                setToast({ id: Math.random(), message: getResponseError('HTML_ERROR_' + response.status, language), alertColor: 'error' });
            }
        }
        setCheckedIds([]);

    };
    return (
        <CenterBox>
            {loadingText !== '' ?
                <Loader text={loadingText} />
                :
                <>
                    <List>
                        {personelList?.filter((e) => e.isRequest === true).map((personel) =>
                            <ListItem key={personel.id} sx={{ gap: '1rem' }}>
                                <Checkbox onChange={handleToggle(personel.id)} />
                                <ListItemAvatar>
                                    <Avatar alt={personel.name} src={profilePictureUrl + personel.profilePicture} sx={{ width: 64, height: 64 }} />
                                </ListItemAvatar>
                                <ListItemText>
                                    <Typography variant='body2' component='p' gutterBottom>
                                        {personel.name}
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                        )}
                    </List>
                    <Button variant='contained' onClick={updateRequests} disabled={checkedIds.length < 1} color='primary' sx={{ margin: '1rem' }}>
                        {personelManagementPage.acceptRequests}
                    </Button>
                </>
            }

        </CenterBox>
    );
};

export default JobRequestTab;