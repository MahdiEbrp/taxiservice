import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import CenterBox from '../../controls/CenterBox';
export type AdditionalInfoProps = {
    onSubscriberIDChanged: (subscriberID: string) => void;
    onDescriptionChanged: (description: string) => void;
};

const AdditionalInfo = (props: AdditionalInfoProps) => {
    const { onSubscriberIDChanged, onDescriptionChanged } = props;

    const { language } = useContext(LanguageContext);
    const { tripCreationPage } = language;

    const subscriberIDMaxLength = 30;
    const descriptionMaxLength = 300;

    const handleSubscriberIDChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onSubscriberIDChanged(event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onDescriptionChanged(event.target.value);
    };

    return (
        <CenterBox>
            <TextField label={tripCreationPage.subscriberID} onBlur={handleSubscriberIDChange} inputProps={{
                maxLength: subscriberIDMaxLength,
            }} />
            <TextField label={tripCreationPage.additionalInfo} onBlur={handleDescriptionChange} multiline inputProps={{
                maxLength: descriptionMaxLength,
            }} sx={{ width: 'min(80vw,400px)' }} />
            <Alert severity='info'>
                {tripCreationPage.additionalInfoMessage}
            </Alert>
        </CenterBox>
    );
};

export default AdditionalInfo;