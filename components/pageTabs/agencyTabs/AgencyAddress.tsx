
import dynamic from 'next/dynamic';
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import TabPanel from '../../controls/TabPanel';

export type AgencyAddressProps = {
    currentStep: number;
    localization: string,
};
const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });
const AgencyAddress = (props: AgencyAddressProps) => {

    const { currentStep, localization } = props;

    return (
        <TabPanel activeIndex={currentStep.toString()} index='2'>
            <PlacesSearchBox localization={localization} />
            <Map />
        </TabPanel>
    );
};

export default AgencyAddress;