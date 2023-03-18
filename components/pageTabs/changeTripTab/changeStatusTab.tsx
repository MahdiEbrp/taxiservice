import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CenterBox from '../../controls/CenterBox';
import React, { useContext, useState } from 'react';
import Tab from '@mui/material/Tab';
import TabPanel from '../../controls/TabPanel';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../context/LanguageContext';
import { ToastContext } from '../../context/ToastContext';
import { Trip } from '../../../types/trips';
import { getResponseError } from '../../../lib/language';
import { postData } from '../../../lib/axiosRequest';
import Loader from '../../controls/Loader';
import Box from '@mui/material/Box';
import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import Alert from '@mui/material/Alert';


const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

export type UpdateTripProps = {
    action: string;
    trip: Trip;
    onReselect: () => void;
    onUpdate: (trips: Trip[]) => void;
};

const ChangeTripStatus = (props: UpdateTripProps) => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { trip, action, onReselect, onUpdate } = props;

    const { setToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext);

    const { changeStatus, tripRequestsPage, settings, notification } = language;
    const [loadingText, setLoadingText] = useState('');
    const [tabID, setTabId] = useState('viewTab');
    const [status, setStatus] = useState(-1);

    const OriginMarker = { location: [trip.originLatitude || 0, trip.originLongitude || 0], text: tripRequestsPage.originAddress };
    const destinationMarker = { location: [trip.destinationLatitude || 0, trip.destinationLongitude || 0], text: tripRequestsPage.destinationAddress };
    const handleRequest = async () => {

        if (action === 'modify' && ![0, 3].includes(status)) {
            setToast({ id: Date.now(), message: notification.statusRequired, alertColor: 'warning' });
            setTabId('modifyTab');
            return;
        }

        setLoadingText(changeStatus.modifyingRequest);
        const response = await postData(`${publicUrl}/api/trips/changeStatusTrip`, { id: trip.id, status: status });
        setLoadingText('');

        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response && response.status === 200) {
            setToast({ id: Math.random(), message: notification.operationSuccess, alertColor: 'success' });
            onUpdate(response.data as Trip[]);
            onReselect();
            return;
        }
        const { error } = response.data as { error: string; };
        if (error)
            setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
        else
            setToast({ id: Date.now(), message: getResponseError('HTML_ERROR_' + response.status, language), alertColor: 'error' });

    };
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabId(newValue);
    };
    const handleStatus = (element: TaggedItem<number> | null) => {
        if (element)
            setStatus(element.tag);
        else
            setStatus(-1);
    };

    const items = [{ displayText: changeStatus.unconfirmed, tag: 0 }, { displayText: changeStatus.rejectedByAgency, tag: 3 }];

    return (
        <>
            <Card dir={settings.direction} sx={{
                backgroundColor: 'transparent !important',
                backdropFilter: 'none !important'
            }}
            >
                <CardContent>
                    {loadingText === '' &&
                        <Tabs value={tabID} onChange={handleChange} aria-label='change status tabs'>
                            <Tab value='viewTab' label={changeStatus.viewInformation} />
                            {action === 'modify' && <Tab value='modifyTab' label={changeStatus.modify} />}
                        </Tabs>
                    }
                    <Box sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                        <TabPanel index='viewTab' activeIndex={tabID} >
                            <CenterBox>
                                <Map currentLocation={[trip.destinationLatitude, trip.destinationLongitude]}
                                    markers={[OriginMarker, destinationMarker]}
                                    onLocationChanged={() => void 0} />
                                <Typography variant='body1'>{`${tripRequestsPage.originAddress} : ${trip.originAddress}`}</Typography>
                                <Typography variant='body1'>{`${tripRequestsPage.destinationAddress} : ${trip.destinationAddress}`}</Typography>
                            </CenterBox>
                        </TabPanel>
                        <TabPanel index='modifyTab' activeIndex={tabID}>
                            <CenterBox>
                                <AutoCompletePlus items={items} label={changeStatus.tripStatus} onChanged={handleStatus} />
                                <Alert severity='info'>
                                    {changeStatus.statusTip}
                                </Alert>
                            </CenterBox>
                        </TabPanel>
                    </Box>
                    {loadingText && <Loader text={loadingText} />}
                </CardContent>
                <CardActions sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                    <Button onClick={() => onReselect()}>{changeStatus.back}</Button>
                    {action === 'modify' &&
                        <Button onClick={() => handleRequest()}>{changeStatus.modify}</Button>
                    }

                </CardActions>
            </Card>
        </>
    );
};

export default ChangeTripStatus;