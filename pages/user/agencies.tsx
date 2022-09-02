import AuthorizedLayout from '../../components/AuthorizedLayout';
import ModifyAgency from '../../components/pageTabs/ModifyAgency';
import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { CountryType } from '../../lib/geography';
import { CountryListContext } from '../../lib/context/CountryListContext';

const Agencies = ({ countries }: InferGetStaticPropsType<typeof getStaticProps>) => {

    const router = useRouter();
    const mode = router.query['mode'] as string | '';

    const { language } = useContext(LanguageContext);

    const { agenciesPage } = language;
    const editMode = mode === 'edit';
    return (
        <CountryListContext.Provider value={{ countryList: countries }}>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
            <AuthorizedLayout>
                <ModifyAgency editMode={editMode} />
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