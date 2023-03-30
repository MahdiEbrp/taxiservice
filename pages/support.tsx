/* eslint-disable max-lines */
import Alert from '@mui/material/Alert';
import AutoCompletePlus, { TaggedItem } from '../components/controls/AutoCompletePlus';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import ForcedPatternInput from '../components/controls/ForcedPatternInput';
import Head from 'next/head';
import ImageLoader from '../components/controls/ImageLoader';
import Link from '@mui/material/Link';
import Loader from '../components/controls/Loader';
import ReCAPTCHA from 'react-google-recaptcha';
import React, { useContext, useEffect, useState, useRef } from 'react';
import TabPanel from '../components/controls/TabPanel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { AgencyData, AgencyDataList } from '../types/agencies';
import { LanguageContext } from '../components/context/LanguageContext';
import { ThemeContext } from '../components/context/ThemeContext';
import { ToastContext } from '../components/context/ToastContext';
import { centerStyle } from '../components/controls/CenterBox';
import { getData, postData } from '../lib/axiosRequest';
import { getResponseError } from '../lib/language';
import { onlyNumbersRegex } from '../lib/validator';

const Map = dynamic(() => import('../components/controls/OpenLayerMap'), { ssr: false });


const Support = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const titleRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const phoneNumberRef = useRef<HTMLTextAreaElement>(null);

    const { setToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext);
    const { prefersDarkMode } = useContext(ThemeContext);

    const { settings, supportPage, notification } = language;

    const [loadingText, setLoadingText] = useState('');
    const [reload, setReload] = useState(true);
    const [agencies, setAgencies] = useState<AgencyDataList | undefined>(undefined);
    const [selectedAgency, setSelectedAgency] = useState<AgencyData | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [captchaError, setCaptchaError] = useState(false);
    const [captcha, setCaptcha] = useState<string | false>(false);

    const reloadButtonStyle = settings.direction === 'ltr' ? { marginRight: 'auto' } : { marginLeft: 'auto' };
    const maxStep = 2;
    useEffect(() => {
        if (!agencies || reload) {
            const getDataAsync = async () => {
                setLoadingText(supportPage.receivingData);
                const response = await getData(publicUrl + '/api/agency/unauthorizedRetrieve');
                setLoadingText('');
                setReload(false);
                if (response && response.status === 200) {
                    setAgencies(response.data as AgencyDataList);
                }
            };
            getDataAsync();
        }
    }, [agencies, publicUrl, reload, supportPage.receivingData]);

    const agencyNames = agencies?.map((agency) => {
        return {
            displayText: agency.agencyName,
            tag: agency.id
        };
    });

    const handleAgencyChange = (item: TaggedItem<string> | null) => {
        if (!item || !agencies) {
            setSelectedAgency(null);
            return;
        }
        const selectAgency = agencies.find((agency) => agency.id === item.tag) ?? null;
        setSelectedAgency(selectAgency);
    };

    const nextStep = () => {
        if (!selectedAgency) {
            setToast({ id: Date.now(), message: notification.selectAgency, alertColor: 'error' });
            return;
        }
        setCurrentStep((currentStep) => currentStep + 1);
    };
    const previousStep = () => {
        if (currentStep < 1)
            return;
        setCurrentStep((currentStep) => currentStep - 1);
    };
    const gotoStep = (step: number) => {
        setCurrentStep(step);
    };
    const reloadData = () => {
        setReload(true);
        setSelectedAgency(null);
        setCurrentStep(0);
    };
    const BreadcrumbsSteps = () => {
        const stepsLabel = [supportPage.agencySelection, supportPage.viewInformation, supportPage.submitMessage].slice(0, currentStep + 1);
        if (loadingText !== '')
            return <></>;
        return (
            <Breadcrumbs separator='›' aria-label='agency-breadcrumb'>
                {stepsLabel.map((label, index) => {
                    return (
                        <Link key={index} onClick={() => gotoStep(index)} color='text.primary'>
                            {label}
                        </Link>
                    );
                }
                )}
            </Breadcrumbs>
        );
    };
    const handleCaptchaChange = (token: string | null) => {
        if (captchaError)
            setCaptchaError(false);

        if (typeof token === 'string') {
            setCaptcha(token);
        }
        else {
            setCaptcha(false);
        }
    };
    const sendMessage = async () => {

        const title = titleRef.current?.value || '';
        const message = messageRef.current?.value || '';
        const phoneNumber = phoneNumberRef.current?.value || '';

        if (!selectedAgency) {
            setToast({ id: Date.now(), message: notification.selectAgency, alertColor: 'error' });
            return;
        }
        if (title === '' || message === '') {
            setToast({ id: Date.now(), message: notification.messageAndTitleRequired, alertColor: 'error' });
            return;
        }
        if (phoneNumber === '') {
            setToast({ id: Date.now(), message: notification.phoneNumberRequired, alertColor: 'error' });
            return;
        }
        if (!captcha) {
            setToast({ id: Date.now(), message: notification.captchaRequired, alertColor: 'error' });
            return;
        }

        const values = { captcha, agencyID: selectedAgency.id, title, message, phoneNumber };

        setLoadingText(supportPage.sendingMessage);
        const response = await postData(process.env.NEXT_PUBLIC_WEB_URL + '/api/support/insert', values);
        setLoadingText('');

        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response && response.status === 200) {
            setToast({ id: Math.random(), message: notification.operationSuccess, alertColor: 'success' });
            return;
        }
        const { error } = response.data as { error: string; };
        if (error)
            setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
        else
            setToast({ id: Date.now(), message: getResponseError('HTML_ERROR_' + response.status, language), alertColor: 'error' });

    };

    return (
        <>
            <Head>
                <title>{supportPage.title}</title>
            </Head>
            <Card dir={settings.direction} sx={{ margin: '15px' }}>
                <CardHeader title={supportPage.title} />
                {loadingText === '' && currentStep === 0 &&

                    <CardMedia sx={centerStyle}>
                        <ImageLoader src='/images/support.svg' alt={supportPage.supportImageAlt} width={250} height={250} />
                    </CardMedia>
                }
                <CardContent sx={centerStyle}>
                    <TabPanel activeIndex={loadingText ? 'loading' : 'normal'} index='loading'>
                        <Loader text={loadingText} />
                    </TabPanel>
                    <TabPanel activeIndex={loadingText ? 'loading' : 'normal'} index='normal'>
                        <BreadcrumbsSteps />
                        <TabPanel dir={settings.direction} activeIndex={currentStep.toString()} index='0'>

                            <AutoCompletePlus label={supportPage.selectAgency} items={agencyNames}
                                onChanged={handleAgencyChange} />
                        </TabPanel>
                        <TabPanel activeIndex={currentStep.toString()} index='1'>

                            {selectedAgency &&
                                <>
                                    <Typography variant='h6'>
                                        {`${supportPage.agencyName}:${selectedAgency.agencyName}`}
                                    </Typography>
                                    <Alert severity='info'>{supportPage.fasterTip}</Alert>
                                    <Typography variant='body1'>
                                        <Link href={`tell:${selectedAgency.phoneNumber1}`}>
                                            {`${supportPage.phoneNumber1} : ${selectedAgency.phoneNumber1}`}
                                        </Link>
                                        {selectedAgency.phoneNumber2 &&
                                            <Link href={`tell:${selectedAgency.phoneNumber2}`}>
                                                {`${supportPage.phoneNumber2} : ${selectedAgency.phoneNumber2}`}
                                            </Link>
                                        }
                                    </Typography>
                                    <Map currentLocation={[selectedAgency.latitude, selectedAgency.longitude]} onLocationChanged={() => void 0} />
                                </>
                            }
                        </TabPanel>
                        <TabPanel dir={settings.direction} activeIndex={currentStep.toString()} index='2'>

                            <TextField label={supportPage.messageTitle}
                                required
                                inputRef={titleRef}
                                inputProps={{ maxLength: 50 }}
                                helperText={supportPage.messageTitleHelperText}
                            />

                            <ForcedPatternInput pattern={onlyNumbersRegex}
                                required
                                inputRef={phoneNumberRef} dir='ltr' type='tel'
                                label={supportPage.phoneNumber} inputProps={{ maxLength: 30 }}
                                helperText={supportPage.phoneNumberHelperText}
                            />
                            <TextField label={supportPage.messageContent}
                                required
                                multiline inputRef={messageRef}
                                sx={{ width: 'min(90vw, 100ch,500px)', minWidth: 'min(90vw, 100ch,500px)', Height: '400px' }}
                                inputProps={{ maxLength: 300 }}
                                helperText={supportPage.messageContentHelperText}
                            />
                            <ReCAPTCHA
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                                size='compact'
                                theme={prefersDarkMode ? 'dark' : 'light'}
                                onErrored={() => setCaptchaError(true)}
                                onChange={handleCaptchaChange}
                            />
                            {captchaError && <Alert severity='error'>{supportPage.captchaProviderError}</Alert>}
                            <Button onClick={sendMessage}>
                                {supportPage.send}
                            </Button>
                        </TabPanel>
                    </TabPanel>

                </CardContent>
                {loadingText === '' &&
                    <CardActions >
                        <Button variant='contained' color='primary' onClick={reloadData} sx={reloadButtonStyle} >{supportPage.reload}</Button>
                        <Button disabled={currentStep < 1} variant='contained' color='primary' onClick={previousStep}  >
                            {supportPage.previous}
                        </Button>
                        <Button disabled={currentStep >= maxStep} variant='contained' color='primary' onClick={nextStep} >{supportPage.next}</Button>
                    </CardActions>
                }
            </Card>
        </>
    );
};
export default Support;