import Alert from '@mui/material/Alert';
import AuthorizedLayout from '../../components/AuthorizedLayout';
import AutoCompletePlus, { TaggedItem } from '../../components/controls/AutoCompletePlus';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../components/controls/CenterBox';
import Head from 'next/head';
import Loader from '../../components/controls/Loader';
import ProfilePictureDialog from '../../components/dialogs/ProfilePictureDialog';
import React, { useContext, useEffect, useState } from 'react';
import SettingFetcher from '../../components/controls/SettingFetcher';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { AllSettingsContext } from '../../components/context/AllSettingsContext';
import { CountryType, LocalizationInfoType } from '../../lib/geography';
import { FormControlLabel } from '@mui/material';
// eslint-disable-next-line no-duplicate-imports
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { LanguageContext } from '../../components/context/LanguageContext';
import { ToastContext } from '../../components/context/ToastContext';
import { getResponseError } from '../../lib/language';
import { postData } from '../../lib/axiosRequest';
import AdvanceSettingsDialog from '../../components/dialogs/AdvanceSettingsDialog';
import { AccountType } from '../../types/accountType';

const Settings: NextPage = ({ countries }: InferGetStaticPropsType<typeof getStaticProps>) => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { language } = useContext(LanguageContext);
    const { userSettings, setUserSettings } = useContext(AllSettingsContext);
    const { setToast } = useContext(ToastContext);

    const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
    const [showAdvanceSettingsDialog, setShowAdvanceSettingsDialog] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [fullName, setFullName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showFirstTimeMessage, setShowFirstTimeMessage] = useState(false);
    const [countryList, setCountryList] = useState<TaggedItem<string>[]>();
    const [localization, setLocalization] = useState<string>('');
    const [accountType, setAccountType] = useState(0);
    const [selectedValue, setSelectedValue] = useState('');
    const fullNameChanged = (value: string) => {
        setFullName(value);
    };

    const { settingsPage, settings, notification } = language;

    useEffect(() => {
        if (userSettings) {
            // eslint-disable-next-line quotes
            setProfilePicture(`${publicUrl}/images/profiles/${userSettings.profilePicture}`);
            setFullName(userSettings.name);
            setLocalization(userSettings.localization);
            setAccountType(userSettings.accountType);

        }
    }, [countryList, publicUrl, userSettings]);
    useEffect(() => {
        if (countries) {
            const _items = countries.data.map(country => {
                return { tag: country.code, displayText: country.name };
            });
            setCountryList(_items);
        }
    }, [countries]);

    const handleClick = async () => {

        const fileName = profilePicture.split('/').pop() || '';

        if (fullName.length < 3) {
            setToast({ id: Date.now(), message: notification.nameIsTooShort, alertColor: 'error' });
            return;
        }
        if (fileName === '') {
            setToast({ id: Date.now(), message: notification.profilePictureEmpty, alertColor: 'error' });
            return;
        }
        if (localization === '') {
            setToast({ id: Date.now(), message: notification.localizationEmpty, alertColor: 'error' });
            return;
        }
        const values = {
            name: fullName, profilePicture: fileName, localization: localization, accountType: accountType
        };
        setIsLoading(true);
        // eslint-disable-next-line quotes
        const response = await postData(`${publicUrl}/api/settings/update`, values);
        setIsLoading(false);
        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Date.now(), message: notification.successfullyEditUser, alertColor: 'success' });
            if (userSettings)
                setUserSettings({
                    ...userSettings, name: fullName, profilePicture: fileName,
                    localization: localization, accountType: accountType, isFirstLogin: false
                });
            return;
        }
        const { error } = response.data as { error: string; };
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
    };

    const accessList = [settingsPage.customerAccess, settingsPage.personnelAccess, settingsPage.entrepreneurAccess];
    useEffect(() => {
        if (localization) {
            import('../../data/localization/' + localization + '.json').then((response) => {
                const country = response.default as LocalizationInfoType;
                setSelectedValue(country.name);
            });
        }
    }, [localization]);
    useEffect(() => {
        if (!showFirstTimeMessage && userSettings && userSettings.isFirstLogin) {
            setShowFirstTimeMessage(true);
            setToast({ id: Date.now(), message: notification.firstTimeLogin, alertColor: 'info' });
        }
    }, [notification.firstTimeLogin, setToast, showFirstTimeMessage, userSettings]);

    return (
        <AuthorizedLayout role={AccountType.customer}>
            <>
                <Head>
                    <title>{settingsPage.title}</title>
                </Head>
                <Card dir={settings.direction}>
                    <CardHeader title={settingsPage.title} />
                    {
                        isLoading ?

                            <Loader text={settingsPage.loading} />
                            :
                            <>
                                {
                                    userSettings ?
                                        <>
                                            <CardContent>
                                                <CenterBox>
                                                    <TextField sx={{ width: 'min(70vw, 300px)' }} label={settingsPage.fullName} onBlur={(e) => fullNameChanged(e.target.value)}
                                                        inputProps={{ maxLength: 300 }} helperText={settingsPage.fullNameDescription}
                                                        defaultValue={userSettings?.name} />
                                                    <Avatar sx={{ width: 100, height: 100, marginTop: 2, marginBottom: 2, cursor: 'pointer' }} src={profilePicture}
                                                        onClick={() => setShowProfilePictureDialog(true)} />
                                                    <Typography variant='caption' display='block' gutterBottom>
                                                        {settingsPage.profilePictureDescription}
                                                    </Typography>
                                                    <AutoCompletePlus items={countryList} selectedValue={selectedValue} onChanged={(country) => setLocalization(!country ? '' : country.tag)} label={settingsPage.localization} />
                                                    <Alert severity='warning'>
                                                        {settingsPage.localizationWarning}
                                                    </Alert>
                                                    <CenterBox>
                                                        <Typography variant='body1' display='block'>
                                                            {settingsPage.selectAccountType}
                                                        </Typography>
                                                        <Tabs value={accountType} onChange={(e, newValue) => setAccountType(newValue)} aria-label='account type'>
                                                            <Tab label={settingsPage.customer} value={0} />
                                                            <Tab label={settingsPage.personnel} value={1} />
                                                            <Tab label={settingsPage.entrepreneur} value={2} />
                                                        </Tabs>
                                                        <CenterBox sx={{ alignItems: 'start' }}>
                                                            {accessList.map((item, index) => {
                                                                return (
                                                                    <FormControlLabel key={index} label={item}
                                                                        control={<Switch checked={accountType > index - 1} onChange={(e) => e.preventDefault()} onClick={(e) => e.preventDefault()} />}
                                                                    />
                                                                );
                                                            })}
                                                        </CenterBox>
                                                    </CenterBox>
                                                    <Button variant='contained' onClick={() => setShowAdvanceSettingsDialog(true)} >
                                                        {settingsPage.advancedSettings}
                                                    </Button>
                                                    <Typography variant='body1' display='block' gutterBottom>
                                                        {settingsPage.advancedSettingsDescription}
                                                    </Typography>
                                                </CenterBox>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'end' }}>
                                                <Button variant='contained' color='primary' onClick={() => handleClick()}>
                                                    {settingsPage.save}
                                                </Button>
                                            </CardActions>
                                        </>
                                        :
                                        <SettingFetcher />
                                }
                            </>
                    }
                </Card>
                <ProfilePictureDialog isDialogOpen={showProfilePictureDialog} onProfileChange={(profilePicture) => setProfilePicture(profilePicture)}
                    onClose={() => setShowProfilePictureDialog(false)} />
                <AdvanceSettingsDialog isDialogOpen={showAdvanceSettingsDialog} onClose={() => setShowAdvanceSettingsDialog(false)} />
            </>
        </AuthorizedLayout>
    );
};
export const getStaticProps: GetStaticProps<{ [key: string]: CountryType; }> = async () => {
    const response = await import('../../data/countryList.json');
    const countryList = response.default as CountryType;
    return {
        props: {
            countries: countryList
        }
    };
};
export default Settings;