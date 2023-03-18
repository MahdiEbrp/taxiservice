import AddPrice from '../../components/pageTabs/priceListTab/AddPrice';
import AuthorizedLayout from '../../components/AuthorizedLayout';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../components/controls/CenterBox';
import EditPrice from '../../components/pageTabs/priceListTab/EditPrice';
import GeneralPriceList from '../../components/pageTabs/priceListTab/GeneralPriceList';
import Head from 'next/head';
import Loader from '../../components/controls/Loader';
import React, { useContext, useEffect, useState } from 'react';
import Tab from '@mui/material/Tab';
import TabPanel from '../../components/controls/TabPanel';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { AccountType } from '../../types/accountType';
import { AgencyDataList } from '../../types/agencies';
import { AllSettingsContext } from '../../components/context/AllSettingsContext';
import { LanguageContext } from '../../components/context/LanguageContext';
import { LocalizationInfoContext } from '../../components/context/LocalizationInfoContext';
import { LocalizationInfoType } from '../../lib/geography';
import { PlacesList } from '../../types/placeType';
import { PriceContext } from '../../components/context/PriceContext';
import { PriceList } from '../../types/priceType';
import { getData } from '../../lib/axiosRequest';
import { NextPage } from 'next/types';

const Prices: NextPage = () => {
    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { language } = useContext(LanguageContext);
    const { setLocalizationInfo } = useContext(LocalizationInfoContext);
    const { userSettings } = useContext(AllSettingsContext);

    const { settings, priceListPage } = language;

    const [agencyList, setAgencyList] = useState<AgencyDataList | undefined>(undefined);
    const [placesList, setPlacesList] = useState<PlacesList | undefined>(undefined);
    const [priceList, setPriceList] = useState<PriceList | undefined>(undefined);
    const [reload, setReload] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [tabID, setTabId] = useState('priceList');
    const [localizationName, setLocalizationName] = useState('');
    useEffect(() => {
        if (!agencyList || reload) {
            const getDataAsync = async () => {
                setLoadingText(priceListPage.receivingData);
                const response = await getData(publicUrl + '/api/prices/retrieve');
                setLoadingText('');
                setReload(false);
                if (response && response.status === 200) {
                    const { agencies, places, prices } = response.data;
                    setAgencyList(agencies as AgencyDataList);
                    setPlacesList(places as PlacesList);
                    setPriceList(prices as PriceList);
                }
            };
            getDataAsync();
        }
    }, [agencyList, publicUrl, reload, priceListPage.receivingData]);

    useEffect(() => {
        const getDataAsync = async () => {
            if (localizationName === '') return;
            const data = await import('../../data/localization/' + localizationName + '.json');
            setLocalizationInfo(data as LocalizationInfoType);
        };
        getDataAsync();
    }, [localizationName, setLocalizationInfo]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabId(newValue);
    };

    if (userSettings && localizationName !== userSettings.localization)
        setLocalizationName(userSettings.localization);

    return (
        <>
            <Head>
                <title>{priceListPage.title}</title>
            </Head>
            <AuthorizedLayout role={AccountType.entrepreneur}>
                <PriceContext.Provider
                    value={{
                        agencyList: agencyList, setAgencyList: setAgencyList,
                        placesList: placesList, setPlacesList: setPlacesList,
                        priceList: priceList, setPriceList: setPriceList,
                    }}>
                    <Card dir={settings.direction}>
                        {loadingText !== '' ?
                            <Loader text={loadingText} />
                            :

                            <>
                                <CardHeader title={priceListPage.title} />
                                <CardContent>
                                    <CenterBox>
                                        {!agencyList || agencyList.length === 0 ?
                                            <Typography variant='body2' >{priceListPage.noAgencies}</Typography>
                                            :
                                            <>
                                                <Tabs value={tabID} onChange={handleChange} aria-label='price tabs'>
                                                    <Tab value='priceList' label={priceListPage.priceList} />
                                                    <Tab value='addPrice' label={priceListPage.addPrice} />
                                                    <Tab value='editPrice' label={priceListPage.editPrice} />
                                                </Tabs>
                                                <TabPanel activeIndex={tabID} index='priceList'>
                                                    <GeneralPriceList />
                                                </TabPanel>
                                                <TabPanel activeIndex={tabID} index='addPrice'>
                                                    <AddPrice />
                                                </TabPanel>
                                                <TabPanel activeIndex={tabID} index='editPrice'>
                                                    <EditPrice />
                                                </TabPanel>
                                            </>
                                        }
                                    </CenterBox>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'end' }}>
                                    <Button variant='contained' onClick={() => setReload(true)}>{priceListPage.reload}</Button>
                                </CardActions>
                            </>

                        }

                    </Card>
                </PriceContext.Provider>
            </AuthorizedLayout>
        </>
    );
};

export default Prices;