import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getData } from '../../lib/axiosRequest';
import { Settings } from '../../types/settings';
import { AllSettingsContext } from '../context/AllSettingsContext';
import { LanguageContext } from '../context/LanguageContext';
import CenterBox from './CenterBox';

const SettingFetcher = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { userSettings, setUserSettings } = useContext(AllSettingsContext);
    const { language } = useContext(LanguageContext);

    const [requestId, setRequestId] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const { components } = language;

    useEffect(() => {
        if (!userSettings && requestId > 0) {
            const getDataAsync = async () => {
                setIsLoading(true);
                const response = await getData(publicUrl + '/api/settings/getAllSettings');
                setIsLoading(false);
                if (response && response.status === 200) {
                    setUserSettings(response.data as Settings);
                }
            };
            getDataAsync();
        }
    }, [publicUrl, requestId, setUserSettings, userSettings]);

    return (
        <CenterBox>
            <Alert severity="error">{components.errorLoading}</Alert>
            <Button onClick={() => setRequestId(1 + Math.random())}>
                {components.requestAgain}
            </Button>
        </CenterBox>
    );
};

export default SettingFetcher;