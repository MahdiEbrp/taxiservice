import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import CenterBox from '../../controls/CenterBox';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';
import { PriceContext } from '../../context/PriceContext';
import { PriceType } from '../../../types/priceType';
const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const GeneralPriceList = () => {


    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { agencyList, priceList } = useContext(PriceContext);

    const [location, setLocation] = useState<number[] | null>(null);
    const [selectedAgency, setSelectedAgency] = useState<TaggedItem<string> | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<PriceType | null>(null);

    const { priceListPage } = language;
    const priceListTab = priceListPage.priceListTab;

    const lat = localizationInfo?.lat || 0;
    const long = localizationInfo?.long || 0;
    const defaultLocation = [lat, long];

    useEffect(() => {
        setSelectedPrice(null);
    }, [priceList]);
    const agencies = agencyList?.map((agency) => {
        return {
            tag: agency.id,
            displayText: agency.agencyName,
        };
    });

    const prices = useMemo(() => {
        if (selectedAgency) {
            return priceList?.filter(price => price.agencyId === selectedAgency.tag).map((price) => {
                return {
                    tag: price.id,
                    displayText: price.address,
                };
            });
        }
        return [];
    }, [selectedAgency, priceList]);

    const onPriceItemChanged = (price: TaggedItem<string> | null) => {
        if (!price) {
            setSelectedPrice(null);
            return;
        }
        const priceInfo = priceList?.find(p => p.id === price.tag);
        if (priceInfo) {
            setSelectedPrice(priceInfo);
            setLocation([priceInfo.latitude, priceInfo.longitude]);

        }
    };

    return (
        <>
            <CenterBox>
                <AutoCompletePlus items={agencies || []} label={priceListPage.agencyName} onChanged={e => setSelectedAgency(e)} />
                <AutoCompletePlus items={prices || []} label={priceListPage.priceList} onChanged={e => onPriceItemChanged(e)} />
                {
                    selectedPrice ?
                        <CenterBox sx={{ alignItems: 'flex-start' }}>
                            <Typography variant='body1' component='p' gutterBottom>
                                {`${priceListPage.address}: ${selectedPrice.address}`}
                            </Typography>
                            <Typography variant='body1' component='p' gutterBottom>
                                {`${priceListPage.price}: ${selectedPrice.price}`}
                            </Typography>
                            <Map currentLocation={location || defaultLocation} onLocationChanged={() => void 0} />
                        </CenterBox>
                        :
                        <Typography variant='body1' component='p' gutterBottom>
                            {priceListTab.selectItem}
                        </Typography>
                }

            </CenterBox>
        </>
    );
};

export default GeneralPriceList;