
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import TabPanel from '../../controls/TabPanel';
import { ItemProps } from '../../controls/AutoCompletePlus';
import { useState } from 'react';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../controls/Map'), {
    ssr: false
});


export type AgencyAddressProps = {
    currentStep: number;
    localization: string,
};

const AgencyAddress = (props: AgencyAddressProps) => {

    const { currentStep, localization } = props;

    const [city, setCity] = useState<ItemProps | null>(null);

    return (
        <TabPanel activeIndex={currentStep.toString()} index='2'>
            <PlacesSearchBox localization={localization} onChange={(item) => setCity(item)} />
            <Map />
        </TabPanel>
    );
};

export default AgencyAddress;