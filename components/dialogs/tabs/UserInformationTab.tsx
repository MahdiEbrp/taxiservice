import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { signOut } from 'next-auth/react';
import Loader from '../../controls/Loader';
import { getData } from '../../../lib/axiosRequest';
import { Settings } from '../../../types/settings';
import { LanguageContext } from '../../context/LanguageContext';
import Alert from '@mui/material/Alert';
import { AllSettingsContext } from '../../context/AllSettingsContext';


const UserInformationTab = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const [isLoading, setIsLoading] = useState(true);

    const { language } = useContext(LanguageContext);
    const { userSettings, setUserSettings } = useContext(AllSettingsContext);

    const { userInformationDialog, settings } = language;

    const singOut = async () => {
        setIsLoading(true);
        await signOut({ redirect: false });
        setIsLoading(false);
    };
    useEffect(() => {
        setIsLoading(true);
        if (!userSettings) {
            const getDataAsync = async () => {
                const response = await getData(publicUrl + '/api/settings/getAllSettings');
                if (response && response.status === 200) {
                    setUserSettings(response.data as Settings);
                }
            };
            getDataAsync();
        }
        setIsLoading(false);
    }, [publicUrl, setUserSettings, userSettings]);

    return (
        <div dir={settings.direction}>
            {
                isLoading ?
                    <Loader text={userInformationDialog.loading} />
                    :
                    <CenterBox>
                        {userSettings ?
                            <>
                                <Avatar src={publicUrl + '/images/profiles/' + userSettings.profilePicture} sx={{ width: 100, height: 100 }} />
                                <Typography variant='h5'>{userSettings.name}</Typography>
                                <Typography variant='body2'>{userInformationDialog.emailAddress + ':' + userSettings.email}</Typography>
                            </>
                            :
                            <Alert severity='warning'>{userInformationDialog.settingsNotFound}</Alert>
                        }
                        <Button variant='contained' onClick={singOut}>{userInformationDialog.signOut}</Button>
                    </CenterBox>
            }
        </div>
    );
};

export default UserInformationTab;