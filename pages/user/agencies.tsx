import AuthorizedLayout from '../../components/AuthorizedLayout';
import ModifyAgency from '../../components/pageTabs/ModifyAgency';
import Head from 'next/head';
import { LanguageContext } from '../../components/context/LanguageContext';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AllAgenciesContext } from '../../components/context/AllAgenciesContext';
import useSWR from 'swr';
import { getData } from '../../lib/axiosRequest';
import { AgencyList, AgencyDataList } from '../../types/agencies';
import Loader from '../../components/controls/Loader';
import { UserAgenciesContext } from '../../components/context/UserAgenciesContext';
// eslint-disable-next-line no-duplicate-imports
import type { NextPage } from 'next';

const fetcher = async (url: string) => {
    const data = await getData(url);
    if (!data)
        return [];
    if (data.status !== 200)
        throw new Error(data.statusText);
    return data.data;
};
const Agencies: NextPage = () => {

    const router = useRouter();
    const mode = router.query['mode'] as string | '';

    const [agencyNames, setAgencyNames] = useState<string[]>([]);
    const [agencyData, setAgencyData] = useState<AgencyDataList>([]);

    const { language } = useContext(LanguageContext);

    const { agenciesPage } = language;
    const editMode = mode === 'edit';

    const { data: allAgencyData, error: allAgencyError } = useSWR(process.env.NEXT_PUBLIC_WEB_URL + '/api/agency/getNamesOfAll', fetcher);
    const { data: userAgencyData, error: userAgencyError } = useSWR(process.env.NEXT_PUBLIC_WEB_URL + '/api/agency/retrieve', fetcher);
    const isLoading = editMode ? !userAgencyData && !userAgencyError : !allAgencyData && !allAgencyError;

    useEffect(() => {
        if (allAgencyData) {
            const values = allAgencyData as AgencyList;
            if (Array.isArray(values))
                setAgencyNames(values.map(_ => _.agencyName));
        }
    }, [allAgencyData]);
    useEffect(() => {
        if (userAgencyData)
            setAgencyData(userAgencyData as AgencyDataList);
    }, [userAgencyData]);

    return (
        <>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
            <AuthorizedLayout>
                <AllAgenciesContext.Provider value={{ agencyNames, setAgencyNames }} >
                    <UserAgenciesContext.Provider value={{ agencyData, setAgencyData }}>
                        {isLoading ? <Loader usePaper={true} text={agenciesPage.fetchingAgencies} /> : <ModifyAgency editMode={editMode} />}
                    </UserAgenciesContext.Provider>
                </AllAgenciesContext.Provider>
            </AuthorizedLayout>
        </>
    );
};



export default Agencies;