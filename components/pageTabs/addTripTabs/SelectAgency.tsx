import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import Box from '@mui/material/Box';
import CenterBox from '../../controls/CenterBox';
import Link from '@mui/material/Link';
import React, { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { AgencyData, AgencyDataList } from '../../../types/agencies';
import { AiTwotonePhone } from 'react-icons/ai';
import { LanguageContext } from '../../context/LanguageContext';
import { TbAddressBook } from 'react-icons/tb';
const Map = dynamic(() => import('../../../components/controls/OpenLayerMap'), { ssr: false });
export type SelectAgencyProps= {
    onValuesChange: (agency: AgencyData | null) => void;
    agencies: AgencyDataList | undefined;
}
const SelectAgency = (props: SelectAgencyProps) => {
    const { onValuesChange, agencies } = props;
    const { language } = useContext(LanguageContext);
    const { tripCreationPage } = language;

    const [selectedAgency, setSelectedAgency] = useState<AgencyData | null>(null);

    const handleAgencyChange = (item: TaggedItem<string> | null) => {
        if (!item || !agencies) {
            setSelectedAgency(null);
            onValuesChange(null);
            return;
        }
        const selectAgency = agencies.find((agency) => agency.id === item.tag) ?? null;
        setSelectedAgency(selectAgency);
        onValuesChange(selectAgency);
    };
    const inlineCenterStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
    };
    const agencyNames = agencies?.map((agency) => {
        return {
            displayText: agency.agencyName,
            tag: agency.id
        };
    });

    return (
        <>
            <AutoCompletePlus label={tripCreationPage.activeAgencies} items={agencyNames}
                onChanged={handleAgencyChange} />
            {selectedAgency &&
                <>
                    <CenterBox sx={{ gap: 0, alignItems: 'flex-start' }}>
                        <Box sx={inlineCenterStyle}>
                            <AiTwotonePhone />
                            <Typography variant='body1'>{tripCreationPage.phoneNumber1} : </Typography>
                            <Link href={`tel:${selectedAgency.phoneNumber1}`}>{selectedAgency.phoneNumber1}</Link>
                        </Box>
                        {selectedAgency.phoneNumber2 &&
                            <Box sx={inlineCenterStyle}>
                                <AiTwotonePhone />
                                <Typography variant='body1'>{tripCreationPage.phoneNumber2} : </Typography>
                                <Link href={`tel:${selectedAgency.phoneNumber2}`}>{selectedAgency.phoneNumber2}</Link>
                            </Box>
                        }
                        <Typography variant='body1' sx={inlineCenterStyle}>
                            <TbAddressBook />
                            {`${tripCreationPage.address} : ${selectedAgency.address}`}
                        </Typography>
                    </CenterBox>
                    <Map currentLocation={[selectedAgency.latitude, selectedAgency.longitude]} onLocationChanged={() => void 0} />
                </>
            }
        </>
    );
};

export default SelectAgency;