import AuthorizedLayout from '../../components/AuthorizedLayout';
import EditAgency from '../../components/pageTabs/EditAgency';
import Head from 'next/head';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';
const Agencies = () => {
    /* #region Router section */
    const router = useRouter();
    const mode = router.query['mode'] as string | '';
    /* #endregion */
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    /* #endregion */
    /* #region Language section */
    const { agenciesPage } = language;
    /* #endregion */
    return (
        <>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
            <AuthorizedLayout>
                <>
                    {mode === 'edit' && <EditAgency />}
                </>
            </AuthorizedLayout>

        </>
    );
};

export default Agencies;