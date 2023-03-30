import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import CenterBox from '../../controls/CenterBox';
import React, { useContext, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';
import { SubscriberContext } from '../../context/SubscriberContext';
import { SubscriberData } from '../../../types/subscriberType';
const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const MySubscribers = () => {


    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { agencyList, subscriberList } = useContext(SubscriberContext);

    const [location, setLocation] = useState<number[] | null>(null);
    const [selectedAgency, setSelectedAgency] = useState<TaggedItem<string> | null>(null);
    const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberData | null>(null);

    const { subscribersPage } = language;
    const mySubscribersTab = subscribersPage.mySubscribersTab;

    const lat = localizationInfo?.lat || 0;
    const long = localizationInfo?.long || 0;
    const defaultLocation = [lat, long];

    const agencies = agencyList?.map((agency) => {
        return {
            tag: agency.id,
            displayText: agency.agencyName,
        };
    });

    const subscribers = useMemo(() => {
        if (selectedAgency) {
            return subscriberList?.filter(subscriber => subscriber.agencyId === selectedAgency.tag).map((subscriber) => {
                return {
                    tag: subscriber.id,
                    displayText: subscriber.name + ' - ' + subscriber.subscriberID,
                };
            });
        }
        return [];
    }, [selectedAgency, subscriberList]);

    const onSubscriberChanged = (subscriber: TaggedItem<string> | null) => {
        if (!subscriber) {
            setSelectedSubscriber(null);
            return;
        }
        const subscriberInfo = subscriberList?.find(sub => sub.id === subscriber.tag);
        if (subscriberInfo) {
            setSelectedSubscriber(subscriberInfo);
            setLocation([subscriberInfo.latitude, subscriberInfo.longitude]);

        }
    };

    return (
        <>
            <CenterBox>
                <AutoCompletePlus items={agencies || []} label={subscribersPage.agencyName} onChanged={e => setSelectedAgency(e)} />
                <AutoCompletePlus items={subscribers || []} label={mySubscribersTab.subscriber} onChanged={e => onSubscriberChanged(e)} />
                {
                    selectedSubscriber ?
                        <CenterBox sx={{ alignItems: 'flex-start' }}>
                            <Typography variant='body1' component='p' gutterBottom>
                                {`${subscribersPage.subscriberName}: ${selectedSubscriber.name}`}
                            </Typography>
                            <Typography variant='body1' component='p' gutterBottom>
                                {`${subscribersPage.subscriberID}: ${selectedSubscriber.subscriberID}`}
                            </Typography>
                            <Typography variant='body1' component='p' gutterBottom>
                                {`${subscribersPage.address}: ${selectedSubscriber.address}`}
                            </Typography>
                            {selectedSubscriber.phoneNumber &&
                                <Typography variant='body1' component='p' gutterBottom>
                                    {`${subscribersPage.phoneNumber}: ${selectedSubscriber.phoneNumber}`}
                                </Typography>
                            }
                            {selectedSubscriber.description &&
                                <Typography variant='body1' component='p' gutterBottom>
                                    {`${subscribersPage.description}: ${selectedSubscriber.description}`}
                                </Typography>
                            }
                            <Map currentLocation={location || defaultLocation} onLocationChanged={() => void 0} />
                        </CenterBox>
                        :
                        <Typography variant='body1' component='p' gutterBottom>
                            {mySubscribersTab.selectSubscriber}
                        </Typography>
                }

            </CenterBox>
        </>
    );
};

export default MySubscribers;