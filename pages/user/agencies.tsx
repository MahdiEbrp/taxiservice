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
import { getData } from '../../lib/fetchData';
import { AgencyList } from '../../lib/types/agencies';
import Loader from '../../components/controls/Loader';
const fetcher = (url: string) => getData(url).then(res => res?.data as AgencyList || []);
const Agencies = ({ countries }: InferGetStaticPropsType<typeof getStaticProps>) => {

    const router = useRouter();
    const mode = router.query['mode'] as string | '';
    const [agencyNames, setAgencyNames] = useState<string[]>([]);
    const { language } = useContext(LanguageContext);

    const { agenciesPage } = language;
    const editMode = mode === 'edit';
    const url = process.env.NEXT_PUBLIC_WEB_URL + '/api/agency/getNamesOfAll';

    const { data, error } = useSWR(url, fetcher);
    const isLoading = !data && !error;
    useEffect(() => {
        if (data) {
            setAgencyNames(data.map(_ => _.agencyName));
        }
    }, [data]);

    return (
        <CountryListContext.Provider value={{ countryList: countries }}>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
            <AuthorizedLayout>
                <AllAgenciesContext.Provider value={{ agencyNames, setAgencyNames }} >
                    {isLoading ? <Loader text={agenciesPage.fetchingAgencies} /> : <ModifyAgency editMode={editMode} />}
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