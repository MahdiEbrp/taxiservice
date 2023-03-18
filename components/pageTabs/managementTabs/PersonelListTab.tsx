import Alert from '@mui/material/Alert';
import AutoCompletePlus from '../../controls/AutoCompletePlus';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Loader from '../../controls/Loader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../../context/LanguageContext';
import { PersonelContext } from '../../context/PersonelContext';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { postData } from '../../../lib/axiosRequest';
import { ChangeEvent, Dispatch, SetStateAction, useContext, useState, useEffect, useRef } from 'react';

const PersonelListTab = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const profilePictureUrl = publicUrl + '/images/profiles/';

    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);
    const { personelList, setPersonelList } = useContext(PersonelContext);
    const { personelManagementPage, notification, settings } = language;
    const [loadingText, setLoadingText] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [canDrive, setCanDrive] = useState<boolean>(false);
    const [canSeeReports, setCanSeeReports] = useState<boolean>(false);
    const [canSeeRequests, setCanSeeRequests] = useState<boolean>(false);
    const [isEnable, setIsEnable] = useState<boolean>(false);
    const [isManager, setIsManager] = useState<boolean>(false);
    const [perviousSelectedItem, setPerviousSelectedItem] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const personel = personelList?.filter((e) => e.isRequest === false);
    const taggedItems = personel?.map((e) => {
        return {
            displayText: e.name,
            tag: e.id,
            avatar: profilePictureUrl + e.profilePicture
        };
    });
    useEffect(() => {
        if (selectedItem !== '' && personel && perviousSelectedItem !== selectedItem) {
            const selectedPersonel = personel?.find((e) => e.id === selectedItem);
            if (selectedPersonel) {
                setPosition(selectedPersonel.position);
                setCanDrive(selectedPersonel.canDrive);
                setCanSeeReports(selectedPersonel.canSeeReports);
                setCanSeeRequests(selectedPersonel.canSeeRequests);
                setIsEnable(selectedPersonel.isEnable);
                setIsManager(selectedPersonel.isManager);
                setPerviousSelectedItem(selectedItem);
                if (inputRef.current && inputRef.current.value) {
                    inputRef.current.value = selectedPersonel.position;
                    inputRef.current.focus();
                }
            }
        }
    }, [personel, perviousSelectedItem, selectedItem]);
    const activeItem = personel?.find((e) => e.id === selectedItem);

    const CheckedListItem = (props: {
        label: string,
        dispatch: Dispatch<SetStateAction<boolean>>;
        checked: boolean;
    }) => {
        const { label, dispatch, checked } = props;
        const handleChanged = (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(e.target.checked);
        };
        return (
            <ListItem sx={{ gap: '1rem' }}>
                <Checkbox checked={checked} onChange={handleChanged} />
                <ListItemText>
                    <Typography variant='body2' component='p' sx={{ textAlign: 'start' }} gutterBottom>
                        {label}
                    </Typography>
                </ListItemText>
            </ListItem>
        );
    };
    const updateRequests = async () => {

        if (position.trim() === '') {
            setToast({ id: Math.random(), message: notification.jobPositionRequired, alertColor: 'error' });
            return;
        }
        setLoadingText(personelManagementPage.acceptingRequests);
        const response = await postData('/api/personel/updatePermissions', {
            position: position,
            canDrive: canDrive,
            canSeeReports: canSeeReports,
            canSeeRequests: canSeeRequests,
            isEnable: isEnable,
            isManager: isManager,
            id: selectedItem,
        });
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            const updatedPersonelList = personelList?.map((e) => {
                if (e.id === selectedItem) {
                    e.position = position;
                    e.canDrive = canDrive;
                    e.canSeeReports = canSeeReports;
                    e.canSeeRequests = canSeeRequests;
                    e.isEnable = isEnable;
                    e.isManager = isManager;
                }
                return e;
            });
            setPersonelList(updatedPersonelList);
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

    };
    return (
        <>
            {loadingText !== '' ?
                <Loader text={loadingText} />
                :
                <CenterBox dir={settings.direction}>
                    <AutoCompletePlus items={taggedItems} label={personelManagementPage.personelList}
                        onChanged={(e) => setSelectedItem(e?.tag || '')} />
                    {activeItem !== undefined ?
                        <CenterBox>
                            <Avatar src={profilePictureUrl + activeItem.profilePicture} sx={{ width: 84, height: 84 }} />
                            <TextField inputRef={inputRef} label={personelManagementPage.jobPosition} defaultValue={activeItem.position}
                                required onChange={(e) => setPosition(e.target.value)} />
                            <Typography variant='body1' sx={{ textAlign: 'center' }}>
                                {personelManagementPage.workplace + ':' + activeItem.agencyName}
                            </Typography>
                            <List dir={settings.direction}>
                                <CheckedListItem label={personelManagementPage.managementPermission}
                                    dispatch={setIsManager} checked={isManager} />
                                <CheckedListItem label={personelManagementPage.drivingPermission}
                                    dispatch={setCanDrive} checked={canDrive} />
                                <CheckedListItem label={personelManagementPage.reportingPermission}
                                    dispatch={setCanSeeReports} checked={canSeeReports} />
                                <CheckedListItem label={personelManagementPage.acceptRequestsPermission}
                                    dispatch={setCanSeeRequests} checked={canSeeRequests} />
                                <CheckedListItem label={personelManagementPage.activityPermission}
                                    dispatch={setIsEnable} checked={isEnable} />
                            </List>
                            <Alert severity='warning'>
                                {personelManagementPage.activityWarning}
                            </Alert>
                            <Button variant='contained' onClick={updateRequests} color='primary' sx={{ margin: '1rem' }}>
                                {personelManagementPage.updatePermissions}
                            </Button>
                        </CenterBox>
                        :
                        <Typography variant='body2' sx={{ mt: 2, mb: 2 }}>{personelManagementPage.noPersonelSelected}</Typography>
                    }
                </CenterBox>
            }
        </>
    );
};

export default PersonelListTab;