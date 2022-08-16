
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import TabPanel from '../../controls/TabPanel';

export type AgencyAddressProps = {
    currentStep: number;
    localization: string,
};

const AgencyAddress = (props: AgencyAddressProps) => {

    const { currentStep, localization } = props;

    return (
        <TabPanel activeIndex={currentStep.toString()} index='2'>
            <PlacesSearchBox localization={localization} />
        </TabPanel>
    );
};

export default AgencyAddress;