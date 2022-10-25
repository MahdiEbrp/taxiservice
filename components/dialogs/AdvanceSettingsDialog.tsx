import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PasswordTab from './tabs/PasswordTab';
import React,{ useContext, useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import TabPanel from '../controls/TabPanel';
import Tabs from '@mui/material/Tabs';
import { LanguageContext } from '../context/LanguageContext';

export type advancedSettingsProps = {
    isDialogOpen: boolean;
    onClose: () => void;
};

const AdvanceSettingsDialog = (props: advancedSettingsProps) => {

    const [activeTab, setActiveTab] = useState('password');
    const { isDialogOpen, onClose } = props;
    const { language } = useContext(LanguageContext);

    const [open, setOpen] = useState(false);


    const { settings, advanceSettingsDialog } = language;

    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    useEffect(() => {
        setOpen(isDialogOpen);
    }, [isDialogOpen]);



    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={() => handleClose()}
            aria-labelledby='advance-setting-dialog-title'
            aria-describedby='advance-setting-dialog-description'
            dir={settings.direction}
        >
            <DialogTitle id='advance-setting-title'>
                {advanceSettingsDialog.title}
            </DialogTitle>
            <DialogContent>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label='advance-settings-tabs'>
                    <Tab value='password' label={advanceSettingsDialog.password} />
                    <Tab value='email' label={advanceSettingsDialog.email} />
                </Tabs>
                <TabPanel activeIndex={activeTab} index='password'><PasswordTab /></TabPanel>
            </DialogContent>
        </Dialog>
    );
};

export default AdvanceSettingsDialog;