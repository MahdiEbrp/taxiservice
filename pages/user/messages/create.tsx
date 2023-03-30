import AuthorizedLayout from '../../../components/AuthorizedLayout';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../../components/controls/CenterBox';
import Head from 'next/head';
import Loader from '../../../components/controls/Loader';
import React, { useContext, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { ToastContext } from '../../../components/context/ToastContext';
import { UserDataList } from '../../../types/users';
import { getData, postData } from '../../../lib/axiosRequest';
import { getResponseError } from '../../../lib/language';
import { AccountType } from '../../../types/accountType';

const CreateMessage: NextPage = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const profilePictureUrl = publicUrl + '/images/profiles/';

    const titleRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);

    const [users, setUsers] = useState<UserDataList | undefined>(undefined);
    const [reload, setReload] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<UserDataList | undefined>(undefined);
    const { createMessagePage, notification, components, settings } = language;

    const [loadingText, setLoadingText] = useState<string>('');

    useEffect(() => {
        if (!users || reload) {
            const getDataAsync = async () => {
                setLoadingText(createMessagePage.receivingUsers);
                const response = await getData(publicUrl + '/api/messages/getUsers');
                setLoadingText('');
                setReload(false);
                if (response && response.status === 200) {
                    setUsers(response.data as UserDataList);
                }
            };
            getDataAsync();
        }
    }, [createMessagePage.receivingUsers, publicUrl, reload, users]);

    const autoCompleteStyle = {
        '& .MuiAutocomplete-inputRoot': {
            width: 'min(90vw, 100ch,500px)',
            minWidth: 'min(90vw, 100ch,500px)'
        },
        '& .MuiChip-root': {
            direction: 'ltr'
        },
    };
    const sendMessage = async () => {
        const title = titleRef.current?.value || '';
        const message = messageRef.current?.value || '';

        if (title === '' && message === '') {
            setToast({ id: Math.random(), message: notification.messageAndTitleRequired, alertColor: 'warning' });
            return;
        }
        if (!selectedUsers || selectedUsers.length === 0) {
            setToast({ id: Math.random(), message: notification.notSelectedUser, alertColor: 'warning' });
            return;
        }
        const data = { title: title, message: message, users: selectedUsers.map(u => u.id) };
        setLoadingText(createMessagePage.sendingMessage);
        const response = await postData(publicUrl + '/api/messages/create', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Date.now(), message: notification.messageSent, alertColor: 'success' });
            return;
        }
        let { error } = response.data as { error: string; };
        error = !error ? `HTML_ERROR_${response.status}` : error;
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
    };
    return (
        <AuthorizedLayout role={AccountType.customer}>
            <>
                <Head>
                    <title>{createMessagePage.title}</title>
                </Head>
                <Card>
                    <CardHeader title={createMessagePage.title} />
                    <CardContent dir={settings.direction}>
                        <Box sx={{ display: loadingText !== '' ? 'flex' : 'none' }}>
                            <Loader text={loadingText} />
                        </Box>
                        <Box sx={{ display: loadingText === '' && !users ? 'flex' : 'none' }}>
                            <Typography variant='body2'>
                                {createMessagePage.noUser}
                            </Typography>
                        </Box>
                        <CenterBox sx={{ display: loadingText === '' && users ? 'flex' : 'none' }}>
                            <>
                                <Autocomplete
                                    multiple
                                    limitTags={2}
                                    id='multiple-limit-users'
                                    options={users || []}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option) =>
                                        <li dir={settings.direction} {...props}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }} >
                                                <Avatar src={profilePictureUrl + option.profilePicture} alt={option.name} />
                                                {option.name}
                                            </Box>
                                        </li>
                                    }
                                    noOptionsText={components.noOptionsText}
                                    loadingText={components.loadingText}
                                    onChange={(event, value) => setSelectedUsers(value)}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label={createMessagePage.Receiver} />
                                    }
                                    sx={autoCompleteStyle}
                                />
                                <TextField label={createMessagePage.messageTitle}
                                    required
                                    inputRef={titleRef}
                                    inputProps={{ maxLength: 50 }} />
                                <TextField label={createMessagePage.messageContent}
                                    required
                                    multiline inputRef={messageRef}
                                    sx={{ width: 'min(90vw, 100ch,500px)', minWidth: 'min(90vw, 100ch,500px)', Height: '400px' }}
                                    inputProps={{ maxLength: 300 }}

                                />
                                <Button variant='contained' color='primary' onClick={() => sendMessage()}>
                                    {createMessagePage.send}
                                </Button>

                            </>
                        </CenterBox>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => setReload(true)} >
                            {createMessagePage.reload}
                        </Button>
                    </CardActions>
                </Card>
            </>
        </AuthorizedLayout >
    );
};

export default CreateMessage;