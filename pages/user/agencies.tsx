import AuthorizedLayout from '../../components/AuthorizedLayout';
import EditAgency from '../../components/pageTabs/EditAgency';
import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { CountryType } from '../../lib/Geography';
import { CountryListContext } from '../../lib/context/CountryListContext';

const Agencies = ({ countries }: InferGetStaticPropsType<typeof getStaticProps>) => {

    const router = useRouter();
    const mode = router.query['mode'] as string | '';

    const { language } = useContext(LanguageContext);

    const { agenciesPage } = language;

    return (
        <CountryListContext.Provider value={{ countryList: countries }}>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
            <AuthorizedLayout>
                <>
                    {mode === 'edit' && <EditAgency />}
                </>
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