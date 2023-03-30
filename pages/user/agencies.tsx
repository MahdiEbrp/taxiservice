import AuthorizedLayout from '../../components/AuthorizedLayout';
import ModifyAgency from '../../components/pageTabs/ModifyAgency';
import Head from 'next/head';
import { LanguageContext } from '../../components/context/LanguageContext';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AllAgenciesContext } from '../../components/context/AllAgenciesContext';
import { getData } from '../../lib/axiosRequest';
import { AgencyList, AgencyDataList } from '../../types/agencies';
import Loader from '../../components/controls/Loader';
import { UserAgenciesContext } from '../../components/context/UserAgenciesContext';
// eslint-disable-next-line no-duplicate-imports
import type { NextPage } from 'next';
import { AccountType } from '../../types/accountType';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CenterBox from '../../components/controls/CenterBox';
import Alert from '@mui/material/Alert';

const Agencies: NextPage = () => {

    const router = useRouter();
    const mode = router.query['mode'] as string | '';

    const [agencyNames, setAgencyNames] = useState<string[]>([]);
    const [agencyData, setAgencyData] = useState<AgencyDataList>([]);

    const { language } = useContext(LanguageContext);
    const { agenciesPage, settings } = language;
    const [currentMode, setCurrentMode] = useState<undefined | boolean>(undefined);
    const [loadingText, setLoadingText] = useState<string>(agenciesPage.fetchingAgencies);
    const [reload, setReload] = useState(true);
    const [errorText, setErrorText] = useState('');
    const editMode = mode === 'edit';
    useEffect(() => {
        if (editMode !== currentMode) {
            setCurrentMode(true);
            setReload(true);
        }
    }, [currentMode, editMode, mode]);
    useEffect(() => {
        if (reload) {
            const markAsRead = async () => {
                setErrorText('');
                setLoadingText(agenciesPage.fetchingAgencies);
                const response = await getData(process.env.NEXT_PUBLIC_WEB_URL + '/api/agency/getData');
                setReload(false);
                setLoadingText('');
                if (response && response.status === 200) {
                    const { myAgencies, allAgencyNames } = response.data;
                    setAgencyData(myAgencies as AgencyDataList);
                    const agencies = allAgencyNames as AgencyList;
                    if (Array.isArray(agencies))
                        setAgencyNames(agencies.map(_ => _.agencyName));
                }
                else
                    setErrorText(agenciesPage.errorLoading);
            };
            markAsRead();
        }
    }, [agenciesPage.errorLoading, agenciesPage.fetchingAgencies, reload]);

    return (
        <>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
            <AuthorizedLayout role={AccountType.entrepreneur}>
                <AllAgenciesContext.Provider value={{ agencyNames, setAgencyNames }} >
                    <UserAgenciesContext.Provider value={{ agencyData, setAgencyData }}>

                        {loadingText !== '' ?
                            <Card dir={settings.direction}>
                                <CenterBox>
                                    {errorText !== '' ?
                                        <>
                                            <Alert severity='error'>
                                                {errorText}
                                            </Alert>
                                            <CardActions>
                                                <Button onClick={() => setReload(true)}>{agenciesPage.reload}</Button>
                                            </CardActions>
                                        </>
                                        :
                                        <Loader text={loadingText} />
                                    }
                                </CenterBox>
                            </Card>
                            :
                            <ModifyAgency editMode={editMode} onReload={()=>setReload(true)} />
                        }

                    </UserAgenciesContext.Provider>
                </AllAgenciesContext.Provider>
            </AuthorizedLayout>
        </>
    );
};



export default Agencies;