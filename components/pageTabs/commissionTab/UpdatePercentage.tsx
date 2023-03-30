import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import ForcedPatternInput from '../../controls/ForcedPatternInput';
import React, { useContext, useRef, useState, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { AgencyDataList } from '../../../types/agencies';
import { LanguageContext } from '../../context/LanguageContext';
import { Trip } from '../../../types/trips';
import { onlyNumbersRegex } from '../../../lib/validator';
import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
export type UpdatePercentageProps = {
    onPercentageChange: (text: Trip[] | []) => void;
    items: Trip[] | undefined;
    agencyData: AgencyDataList;
};
const UpdatePercentage = (props: UpdatePercentageProps) => {

    const commissionRef = useRef<HTMLInputElement>(null);

    const { onPercentageChange, items, agencyData } = props;

    const { language } = useContext(LanguageContext);

    const { commissionPage, settings } = language;

    const [commissionPercentage, setCommissionPercentage] = useState(0);
    const [selectedId, setSelectedId] = useState('');

    const totalEarn = items?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price;
    }, 0) || 0;

    const handlePercentageBlur = () => {
        if (commissionRef.current) {
            let value = Number(commissionRef.current.value);
            if (isNaN(value)) {
                setCommissionPercentage(0);
                commissionRef.current.value = '0';

                return;
            }

            value = value > 100 || value < 0 ? 0 : value;
            setCommissionPercentage(value);
            commissionRef.current.value = value.toString();
        }
    };
    const handleClick = () => {
        const trips = items?.map(e => {
            e.commission = e.price * commissionPercentage / 100;
            return e;
        });
        onPercentageChange(trips || []);
    };
    const agencyList = useMemo(() => {
        if (Array.isArray(agencyData) && agencyData.length > 0) {
            return agencyData.map(agency => {
                return { tag: agency.id, displayText: agency.agencyName };
            });
        }
        return [];
    }, [agencyData]);
    const selectedAgencyData = useMemo(() => {
        if (Array.isArray(agencyData) && agencyData.length > 0) {
            const values = agencyData as AgencyDataList;
            const agency = values.find(agency => agency.id === selectedId);
            if (agency) {
                setCommissionPercentage(agency.commissionRate);
                if (commissionRef.current)
                    commissionRef.current.value = agency.commissionRate.toString();
                return agency;
            }
        }
        return null;
    }, [agencyData, selectedId]);

    const handleAgencyChange = (item: TaggedItem<string> | null) => {
        if (!item)
            return;
        setSelectedId(item.tag);
    };
    const currencySymbol = selectedAgencyData ? selectedAgencyData.currencySymbol : '';

    return (
        <CenterBox>
            {agencyData && agencyData.length > 0 &&
                <AutoCompletePlus items={agencyList} label={commissionPage.localization} onChanged={handleAgencyChange} />
            }
            <Typography variant='body1' component='p'>
                {`${commissionPage.receivedAmounts} : ${totalEarn.toLocaleString(settings.code)} ${currencySymbol}`}
            </Typography>
            <CenterBox wrapMode>
                <Typography variant='body1' component='p'>
                    {commissionPage.commissionPercentage + ' :'}
                </Typography>
                <ForcedPatternInput sx={{ width: '5rem' }} inputProps={{ maxLength: 3 }}
                    onBlur={handlePercentageBlur} inputRef={commissionRef} pattern={onlyNumbersRegex} />
            </CenterBox>
            <Typography variant='body1' component='p'>
                {`${commissionPage.amountOfCommission} : ${(totalEarn * commissionPercentage / 100).toLocaleString(settings.code)} ${currencySymbol}`}
            </Typography>
            <Button onClick={handleClick}>{commissionPage.update}</Button>
        </CenterBox>
    );
};

export default UpdatePercentage;