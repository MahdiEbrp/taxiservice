import AuthorizedLayout from '../../components/AuthorizedLayout';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../components/controls/CenterBox';
import Head from 'next/head';
import ProfilePictureDialog from '../../components/dialogs/ProfilePictureDialog';
import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { LanguageContext } from '../../components/context/LanguageContext';
import { AllSettingsContext } from '../../components/context/AllSettingsContext';
import Loader from '../../components/controls/Loader';
import Alert from '@mui/material/Alert';
// eslint-disable-next-line no-duplicate-imports
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { CountryType } from '../../lib/geography';
import SettingFetcher from '../../components/controls/SettingFetcher';
import AutoCompletePlus, { taggedItem } from '../../components/controls/AutoCompletePlus';

const Settings: NextPage = ({ countries }: InferGetStaticPropsType<typeof getStaticProps>) => {


    const { language } = useContext(LanguageContext);
    const { userSettings } = useContext(AllSettingsContext);

    const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [fullName, setFullName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [countryList, setCountryList] = useState<taggedItem<string>[]>();
    const [localization, setLocalization] = useState<string>('');

    const fullNameChanged = (value: string) => {
        setFullName(value);
    };

    const { settingsPage, settings } = language;

    useEffect(() => {
        if (userSettings) {
            setProfilePicture(userSettings.profilePicture);
        }
    }, [userSettings]);
    useEffect(() => {
        if (countries) {
            const _items = countries.data.map(country => {
                return { tag: country.code, displayText: country.name };
            });
            setCountryList(_items);
        }
    }, [countries]);

    return (
        <AuthorizedLayout>
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
                                                    <Typography variant="caption" display="block" gutterBottom>
                                                        {settingsPage.profilePictureDescription}
                                                    </Typography>
                                                    <AutoCompletePlus onChanged={(code) => setLocalization(!code ? '' : code.tag)} items={countryList}
                                                        label={settingsPage.localization} />
                                                    <Alert severity='warning'>
                                                        {settingsPage .localizationWarning}
                                                    </Alert>
                                                    <Button variant="contained" >{settingsPage.advancedSettings}</Button>
                                                    <Typography variant="caption" display="block" gutterBottom>
                                                        {settingsPage.advancedSettingsDescription}
                                                    </Typography>
                                                </CenterBox>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'end' }}>
                                                <Button variant="contained" color="primary">
                                                    {settingsPage.save}
                                                </Button>
                                            </CardActions>
                                        </>
                                        :
                                      <SettingFetcher/>
                                }
                            </>
                    }
                </Card>
                <ProfilePictureDialog isDialogOpen={showProfilePictureDialog} onProfileChange={(profilePicture) => setProfilePicture(profilePicture)}
                    onClose={() => setShowProfilePictureDialog(false)} />
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