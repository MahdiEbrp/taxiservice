import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, useContext, useMemo, useRef, useState } from 'react';
import { OnlyNumberWithDot } from '../../../lib/validator';
import { PriceList } from '../../../types/priceType';
import { LanguageContext } from '../../context/LanguageContext';
import { ToastContext } from '../../context/ToastContext';
import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import CenterBox from '../../controls/CenterBox';
import ForcedPatternInput from '../../controls/ForcedPatternInput';
import TabPanel from '../../controls/TabPanel';
export type AddPriceProps = {
    onDescriptionChanged: (description: string) => void;
    onTotalCostChanged: (cost: number) => void;
    prices: PriceList | undefined;
    showDescription: boolean;
};

const AddPrice = (props: AddPriceProps) => {

    const { setToast } = useContext(ToastContext);

    const { onDescriptionChanged, onTotalCostChanged, prices, showDescription } = props;

    const { language } = useContext(LanguageContext);
    const { addPriceTab, notification } = language;

    const totalDistanceTraveledRef = useRef<HTMLInputElement>(null);
    const pricePerUnitRef = useRef<HTMLInputElement>(null);
    const totalCostRef = useRef<HTMLInputElement>(null);

    const descriptionMaxLength = 300;

    const [activeTab, setActiveTab] = useState('pricePerLocation');

    const priceList = useMemo(() => {
        if (prices && prices.length > 0) {
            return prices.map(price => {
                return { tag: price.id, displayText: price.address };
            });
        }
        return [];
    }, [prices]);

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onDescriptionChanged(event.target.value);
    };
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    const handleCalculateClick = () => {

        let totalDistanceTraveled = totalDistanceTraveledRef.current?.value || '0';
        let pricePerUnit = pricePerUnitRef.current?.value || '0';

        totalDistanceTraveled = totalDistanceTraveled.replace(/,/g, '');
        pricePerUnit = pricePerUnit.replace(/,/g, '');

        if (!totalCostRef.current) {
            setToast({ id: Date.now(), message: notification.unknownError, alertColor: 'error' });
            return;
        }
        const value = Number(totalDistanceTraveled) * Number(pricePerUnit);
        if (value < 0) {
            setToast({ id: Date.now(), message: notification.incorrectValues, alertColor: 'error' });
            return;
        }
        totalCostRef.current.value = value.toString();
        onTotalCostChanged(value);
        setCommaFormat();

    };
    const handleTotalCostChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const value = event.target.value;
        const number = Number(value);
        if (isNaN(number))
            return;

        onTotalCostChanged(number);

        setCommaFormat();

    };
    const setCommaFormat = () => {

        const totalTraveled = totalDistanceTraveledRef.current?.value || '0';
        const pricePerUnit = pricePerUnitRef.current?.value || '0';
        const totalCost = totalCostRef.current?.value || '0';

        const totalTraveledNum = Number(totalTraveled);
        const pricePerUnitNum = Number(pricePerUnit);
        const totalCostNum = Number(totalCost);

        if (totalDistanceTraveledRef.current && !isNaN(totalTraveledNum))
            totalDistanceTraveledRef.current.value = totalTraveledNum.toLocaleString('en-us');
        if (pricePerUnitRef.current && !isNaN(pricePerUnitNum))
            pricePerUnitRef.current.value = pricePerUnitNum.toLocaleString('en-us');
        if (totalCostRef.current && !isNaN(totalCostNum))
            totalCostRef.current.value = totalCostNum.toLocaleString('en-us');
    };

    const handlePriceChange = (element: TaggedItem<string> | null) => {
        if (element && totalCostRef.current && prices) {
            const selectedItem = prices.find(e => e.id === element.tag);
            if (selectedItem) {
                totalCostRef.current.value = selectedItem.price.toLocaleString('en-us');
                if (onTotalCostChanged)
                    onTotalCostChanged(selectedItem.price);
            }
        }
    };

    return (
        <CenterBox>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label='price-calculator-tabs'>
                <Tab value='pricePerLocation' label={addPriceTab.pricePerLocation} />
                <Tab value='pricePerDistance' label={addPriceTab.pricePerDistance} />
            </Tabs>
            <TabPanel activeIndex={activeTab} index='pricePerLocation'>
                <AutoCompletePlus items={priceList} label={addPriceTab.priceList} onChanged={handlePriceChange} />
                <FormHelperText>
                    {addPriceTab.priceListTip}
                </FormHelperText>
            </TabPanel>
            <TabPanel activeIndex={activeTab} index='pricePerDistance' >
                <CenterBox wrapMode>
                    <ForcedPatternInput pattern={OnlyNumberWithDot}
                        inputRef={totalDistanceTraveledRef} dir='ltr' onBlur={() => setCommaFormat()}
                        label={addPriceTab.totalDistanceTraveled} inputProps={{ maxLength: 10 }} />
                    <ForcedPatternInput pattern={OnlyNumberWithDot} onBlur={() => setCommaFormat()}
                        inputRef={pricePerUnitRef} dir='ltr'
                        label={addPriceTab.pricePerUnit} inputProps={{ maxLength: 10 }} />
                </CenterBox>
                <Alert severity='info'>
                    {addPriceTab.calculateTip}
                </Alert>
                <Button onClick={handleCalculateClick}>
                    {addPriceTab.calculate}
                </Button>
            </TabPanel>
            <ForcedPatternInput required pattern={OnlyNumberWithDot} onBlur={handleTotalCostChanged}
                inputRef={totalCostRef} dir='ltr' helperText={''}
                InputLabelProps={{ shrink: true, lang: 'en-US' }}
                label={addPriceTab.totalCost} inputProps={{ maxLength: 10 }} />
            {showDescription &&
                <TextField label={addPriceTab.additionalInfo} onBlur={handleDescriptionChange} multiline inputProps={{
                    maxLength: descriptionMaxLength,
                }} sx={{ width: 'min(80vw,400px)' }} />
            }
        </CenterBox>
    );
};

export default AddPrice;