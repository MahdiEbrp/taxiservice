import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CenterBox from '../../components/controls/CenterBox';
import ComboBoxWithGroup from '../../components/controls/ComboBoxWithOption';
import Head from 'next/head';
import ImageLoader from '../../components/controls/ImageLoader';
import Link from '@mui/material/Link';
import TabPanel from '../../components/controls/TabPanel';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { ToastContext } from '../../lib/context/ToastContext';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const Agencies = () => {
    const router = useRouter();
    const { mode } = router.query;

    const [selectedAgency, setSelectedAgency] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [title, setTitle] = useState('');
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);
    /* #endregion */
    /* #region Language section */
    const { settings, agenciesPage, notification } = language;
    const { direction } = settings;
    /* #endregion */
    /* #region Functions section */
    const nextStep = () => {
        if (!selectedAgency) {
            setToast({ id: Date.now(), message: notification.selectAgency, alertColor: 'info' });
            return;
        }
        else
            setCurrentStep((currentStep) => currentStep + 1);
    };
    /* #endregion */
    useEffect(() => {
        setTitle(agenciesPage.agencyManagement);
    }, [agenciesPage.agencyManagement]);
    return (
        <>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
            <Card dir={direction}>
                <CardHeader title={title} />
                <CardMedia>
                    <ImageLoader src="/images/agencies.svg" alt='images' width={300} height={300} />
                </CardMedia>
                <CardContent>
                    <CenterBox>
                        <Breadcrumbs separator="›" aria-label="agency-breadcrumb">
                            {currentStep > -1 && <Link key="1" onClick={() => setCurrentStep(0)} color="text.primary">
                                {agenciesPage.agencyManagement}
                            </Link>
                            }
                            {currentStep > 0 && <Link key="1" onClick={() => setCurrentStep(1)} color="text.primary">
                                {agenciesPage.agencySelection}
                            </Link>
                            }
                        </Breadcrumbs>
                        <TabPanel activeIndex={currentStep.toString()} index='0'>
                            <ComboBoxWithGroup onValueChanged={((agency) => setSelectedAgency(agency))} items={['آژانس بانوان خورشید', '131 لاهیجان']}
                                label={agenciesPage.agencyName} />
                        </TabPanel>
                    </CenterBox>
                </CardContent>
                <CardActions sx={{ flexDirection: 'row-reverse' }}>
                    {<Button variant="contained" color="primary" onClick={nextStep} >{agenciesPage.next}</Button>}
                </CardActions>
            </Card>

        </>
    );
};

export default Agencies;