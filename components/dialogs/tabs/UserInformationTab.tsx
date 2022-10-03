import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useSession, signOut } from 'next-auth/react';
import Loader from '../../controls/Loader';
import { getData } from '../../../lib/axiosRequest';
import useSWR from 'swr';
import { Settings } from '../../../types/settings';
import { LanguageContext } from '../../context/LanguageContext';
import Alert from '@mui/material/Alert';

export const settingFetcher = async (url: string) => {
    const data = await getData(url);
    if (!data)
        throw new Error('No data');
    if (data.status !== 200)
        throw new Error(data.statusText);
    return data.data;
};

const UserInformationTab = () => {
    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const { data: settingsData, error: settingsError } = useSWR(publicUrl + '/api/settings/getAllSettings', settingFetcher);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();
    const [setting, setSetting] = useState<Settings | null>(null);

    const { language } = useContext(LanguageContext);
    const { userInformationDialog, settings } = language;

    const singOut = async () => {
        setIsLoading(true);
        await signOut({ redirect: false });
        setIsLoading(false);
    };
    useEffect(() => {
        if (session && settingsData || settingsError) {
            setIsLoading(false);
            if (settingsData)
                setSetting(settingsData as Settings);
        }
    }, [session, settingsData, settingsError]);
    return (
        <div dir={settings.direction}>
            {
                isLoading ?
                    <Loader text={userInformationDialog.loading} />
                    :
                    <CenterBox>
                        {setting ?
                            <>
                                <Avatar src={publicUrl + '/images/profiles/' + setting.profilePicture} sx={{ width: 100, height: 100 }} />
                                <Typography variant='h5'>{setting.name}</Typography>
                                <Typography variant='body2'>{userInformationDialog.emailAddress + ':' + setting.email}</Typography>
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