import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import React, { useContext, useEffect, useState } from 'react';
import SettingFetcher from '../../controls/SettingFetcher';
import Typography from '@mui/material/Typography';
import { AllSettingsContext } from '../../context/AllSettingsContext';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoType } from '../../../lib/geography';
import { signOut } from 'next-auth/react';

const UserInformationTab = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const [isLeaving, setIsLeaving] = useState(false);
    const [localizationName, setLocalizationName] = useState<string | undefined>(undefined);
    const { language } = useContext(LanguageContext);
    const { userSettings,setUserSettings } = useContext(AllSettingsContext);

    const { userInformationDialog, settings, settingsPage } = language;

    const singOut = async () => {
        setIsLeaving(true);
        setUserSettings(null);
        await signOut({ redirect: false });
    };

    const getAccountType = (accountType: number) => {
        switch (accountType) {
            case 0:
                return settingsPage.customer;
            case 1:
                return settingsPage.personnel;
            case 2:
                return settingsPage.entrepreneur;
            default:
                return settingsPage.customer;
        }
    };

    useEffect(() => {
        if (userSettings) {
            import('../../../data/localization/' + userSettings.localization + '.json').then((response) => {
                const countryList = response.default as LocalizationInfoType;
                setLocalizationName(countryList.name);
            });
        }
    }, [userSettings]);

    return (
        <CenterBox dir={settings.direction}>
            {userSettings ?
                <>
                    {isLeaving ?
                        <Typography variant='body2'>{userInformationDialog.leaving}</Typography>
                        :
                        <>
                            <Avatar src={publicUrl + '/images/profiles/' + userSettings.profilePicture} sx={{ width: 100, height: 100 }} />
                            <Typography variant='h5'>{userSettings.name}</Typography>
                            <CenterBox sx={{ alignItems: 'flexStart' }}>
                                <Typography variant='body2'>{userInformationDialog.emailAddress + ':' + userSettings.email}</Typography>
                                <Typography variant='body2'>{userInformationDialog.accountType + ':' + getAccountType(userSettings.accountType)}</Typography>
                                <Typography variant='body2'>{userInformationDialog.localization + ':' + localizationName ||  userSettings.localization}</Typography>
                            </CenterBox>
                        </>
                    }
                </>
                :
                <SettingFetcher />
            }
            <Button variant='contained' onClick={singOut}>{userInformationDialog.signOut}</Button>
        </CenterBox>
    );
};

export default UserInformationTab;