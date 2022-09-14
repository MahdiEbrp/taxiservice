import AuthorizedLayout from '../../components/AuthorizedLayout';
import ModifyAgency from '../../components/pageTabs/ModifyAgency';
import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { LanguageContext } from '../../components/context/LanguageContext';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CountryType } from '../../lib/geography';
import { CountryListContext } from '../../components/context/CountryListContext';
import { AllAgenciesContext } from '../../components/context/AllAgenciesContext';
import useSWR from 'swr';
import { getData } from '../../lib/axiosRequest';
import { AgencyList, AgencyDataList } from '../../lib/types/agencies';
import Loader from '../../components/controls/Loader';
import { UserAgenciesContext } from '../../components/context/UserAgenciesContext';
const fetcher = async (url: string) => {
    const data = await getData(url);
    if (!data)
        return [];
    return data.data ;
};
const Agencies = ({ countries }: InferGetStaticPropsType<typeof getStaticProps>) => {

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
        <CountryListContext.Provider value={{ countryList: countries }}>
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
        </CountryListContext.Provider>
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


export default Agencies;