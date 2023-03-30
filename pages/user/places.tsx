import AuthorizedLayout from '../../components/AuthorizedLayout';
import Head from 'next/head';
import { LanguageContext } from '../../components/context/LanguageContext';
import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-duplicate-imports
import type { NextPage } from 'next';
import { AccountType } from '../../types/accountType';
import CenterBox from '../../components/controls/CenterBox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import TabPanel from '../../components/controls/TabPanel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MyPlaces from '../../components/pageTabs/placesTabs/MyPlaces';
import AddPlace from '../../components/pageTabs/placesTabs/AddPlace';
import { PlacesList } from '../../types/placeType';
import { getData } from '../../lib/axiosRequest';
import { Button } from '@mui/material';
import Loader from '../../components/controls/Loader';
import { PlaceContext } from '../../components/context/PlaceContext';
import { AllSettingsContext } from '../../components/context/AllSettingsContext';
import SettingFetcher from '../../components/controls/SettingFetcher';
import { LocalizationInfoContext } from '../../components/context/LocalizationInfoContext';
import { LocalizationInfoType } from '../../lib/geography';
import EditPlace from '../../components/pageTabs/placesTabs/EditPlace';

const Places: NextPage = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { language } = useContext(LanguageContext);
    const { userSettings } = useContext(AllSettingsContext);
    const { setLocalizationInfo } = useContext(LocalizationInfoContext);
    const { settings, placePage } = language;

    const [tabID, setTabId] = useState('myPlaces');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabId(newValue);
    };
    const [placesList, setPlacesList] = useState<PlacesList | undefined>(undefined);
    const [reload, setReload] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [localizationName, setLocalizationName] = useState('');

    useEffect(() => {
        if (!placesList || reload) {
            const getDataAsync = async () => {
                setLoadingText(placePage.receivingPlaces);
                const response = await getData(publicUrl + '/api/places/retrieve');
                setLoadingText('');
                setReload(false);
                if (response && response.status === 200) {
                    setPlacesList(response.data as PlacesList);
                }
            };
            getDataAsync();
        }
    }, [placePage.receivingPlaces, placesList, publicUrl, reload]);

    if (userSettings && localizationName !== userSettings.localization)
        setLocalizationName(userSettings.localization);

    useEffect(() => {
        const getDataAsync = async () => {
            if (localizationName === '') return;
            const data = await import('../../data/localization/' + localizationName + '.json');
            setLocalizationInfo(data as LocalizationInfoType);
        };
        getDataAsync();
    }, [localizationName, setLocalizationInfo]);

    return (
        <>
            <Head>
                <title>{placePage.title}</title>
            </Head>
            <AuthorizedLayout role={AccountType.customer}>
                <PlaceContext.Provider value={{ placesList, setPlacesList }}>
                    <Card dir={settings.direction}>
                        {!userSettings ?
                            <SettingFetcher />
                            :
                            loadingText ?
                                <Loader text={loadingText} />
                                :
                                <>
                                    <CardHeader title={placePage.title} />
                                    <CardContent>
                                        <CenterBox>
                                            <Tabs value={tabID} onChange={handleChange} aria-label='places tabs'>
                                                <Tab value='myPlaces' label={placePage.myPlaces} />
                                                <Tab value='addPlace' label={placePage.addPlace} />
                                                <Tab value='editPlace' label={placePage.editPlace} />
                                            </Tabs>
                                            <TabPanel activeIndex={tabID} index='myPlaces'>
                                                <MyPlaces />
                                            </TabPanel>
                                            <TabPanel activeIndex={tabID} index='addPlace'>
                                                <AddPlace />
                                            </TabPanel>
                                            <TabPanel activeIndex={tabID} index='editPlace'>
                                                <EditPlace />
                                            </TabPanel>
                                        </CenterBox>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'end' }}>
                                        <Button variant='contained' onClick={() => setReload(true)}>{placePage.reload}</Button>
                                    </CardActions>
                                </>
                        }
                    </Card>
                </PlaceContext.Provider>
            </AuthorizedLayout>
        </>
    );
};



export default Places;