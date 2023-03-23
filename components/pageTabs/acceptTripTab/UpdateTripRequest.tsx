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
import AddPrice from '../addTripTabs/AddPrice';
import { PriceList } from '../../../types/priceType';

const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

export type UpdateTripProps = {
    action: string;
    trip: Trip;
    showTabs: boolean;
    priceList: PriceList | undefined;
    onReselect: () => void;
    onUpdate: (trips: Trip[]) => void;
};

const UpdateTripRequest = (props: UpdateTripProps) => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { trip, action, onReselect, onUpdate, showTabs, priceList } = props;

    const { setToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext);

    const { acceptTrip, tripRequestsPage, settings, notification } = language;
    const [loadingText, setLoadingText] = useState('');
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [tabID, setTabId] = useState('viewTab');

    const OriginMarker = { location: [trip.originLatitude || 0, trip.originLongitude || 0], text: tripRequestsPage.originAddress };
    const destinationMarker = { location: [trip.destinationLatitude || 0, trip.destinationLongitude || 0], text: tripRequestsPage.destinationAddress };
    const handleRequest = async (action: 'cancel' | 'accept') => {

        if (action==='accept' && !price) {
            setToast({ id: Date.now(), message: notification.priceRequired, alertColor: 'error' });
            setTabId('priceTab');
            return;
        }

        setLoadingText(action === 'accept' ? acceptTrip.acceptingRequest : acceptTrip.cancelingRequest);
        const response = await postData(`${publicUrl}/api/personel/${action}Trip`, { id: trip.id, price: price });
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
    return (
        <>
            <Card dir={settings.direction} sx={{
                backgroundColor: 'transparent !important',
                backdropFilter: 'none !important'
            }}
            >
                <CardContent>
                    {showTabs && loadingText === '' &&
                        <Tabs value={tabID} onChange={handleChange} aria-label='update request tabs'>
                            <Tab value='viewTab' label={acceptTrip.viewInformation} />
                            {action === 'accept' && <Tab value='priceTab' label={acceptTrip.priceList} />}
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
                        <TabPanel index='priceTab' activeIndex={tabID}>
                            <AddPrice onDescriptionChanged={() => void 0} showDescription={false}
                                onTotalCostChanged={(cost) => setPrice(cost)} prices={priceList} />
                        </TabPanel>
                    </Box>
                    {loadingText && <Loader text={loadingText} />}
                </CardContent>
                <CardActions sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                    <Button onClick={() => onReselect()}>{acceptTrip.back}</Button>
                    {action === 'accept' &&
                        <Button onClick={() => handleRequest('accept')}>{acceptTrip.accept}</Button>
                    }
                    {action === 'cancel' &&
                        <Button onClick={() => handleRequest('cancel')}>{acceptTrip.cancel}</Button>
                    }
                </CardActions>
            </Card>
        </>
    );
};

export default UpdateTripRequest;