import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import ComboBoxWithGroup from '../../components/controls/ComboBoxWithOption';
import Head from 'next/head';
import ImageLoader from '../../components/controls/ImageLoader';
import Stepper from '@mui/material/Stepper';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { ToastContext } from '../../lib/context/ToastContext';
import { useContext, useState } from 'react';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
const Agencies = () => {
    const [activeStep, setActiveStep] = useState(0);
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);
    /* #endregion */
    /* #region Language section */
    const { settings, agenciesPage } = language;
    const { direction } = settings;
    /* #endregion */
    /* #region Functions section */

    /* #endregion */
    return (
        <>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
            <Card dir={direction}>
                <CardHeader title={agenciesPage.title} />
                <CardMedia>
                    <ImageLoader src="/images/agencies.svg" alt='images' width={300} height={300} />
                </CardMedia>
                <CardContent>
                    <Stepper activeStep={1} alternativeLabel >
                        <Step key={1} >
                            <StepLabel >How can I help you?</StepLabel>
                            <ComboBoxWithGroup items={['آژانس بانوان خورشید', '131 لاهیجان']}
                                label={agenciesPage.agencyName} />
                        </Step>
                        <Step >
                        </Step>
                    </Stepper>
                </CardContent>
            </Card>

        </>
    );
};

export default Agencies;