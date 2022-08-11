import ComboBoxWithGroup from '../controls/ComboBoxWithOption';
import TabPanel from '../controls/TabPanel';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { useContext} from 'react';
export interface AgencySelectorProps {
    currentStep: number;
    onValueChanged: (agency:string) => void;
}
const AgencySelector = (props: AgencySelectorProps) => {
    const { language } = useContext(LanguageContext);

    const { currentStep, onValueChanged } = props;
    return (
        <TabPanel activeIndex={currentStep.toString()} index='0'>
            <ComboBoxWithGroup onValueChanged={((agency) => onValueChanged(agency))} items={['آژانس بانوان خورشید', '131 لاهیجان']}
                label={language.agenciesPage.agencyName} />
        </TabPanel>
    );

};
export default AgencySelector;