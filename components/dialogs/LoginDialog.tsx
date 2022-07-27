import LoginTab from './tabs/LoginTab';
import React,{ useContext, useState } from 'react';
import RegisterTab from './tabs/RegisterTab';
import TabPanel from '../controls/TabPanel';
import { Box, Dialog, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { LoginDialogContext } from '../../lib/context/LoginDialogContext';
import { useSession } from 'next-auth/react';

const LoginDialog = () => {
    const { isLoginDialogOpen, setLoginDialogOpen } = useContext(LoginDialogContext);
    const handleClose = () => {
        setLoginDialogOpen(false);
    };
    const [tabID, setTabId] = useState('login');
    const { data: session } = useSession();

    const { language } = useContext(LanguageContext);
    const rightToLeft = language.settings.rightToLeft;
    const loginDialog  =  language.loginDialog ;

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabId(newValue);
    };
    return (
        <Dialog
            open={isLoginDialogOpen}
            onClose={handleClose}
            aria-labelledby='language-dialog-title'
            aria-describedby='language-dialog-description'
            dir={rightToLeft ? 'rtl' : 'ltr'}
        >
            <DialogTitle id='language-dialog-title'>
                {loginDialog.title}
            </DialogTitle>
            <DialogContent >

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    {session ? <p>You are logged in as {session.user?.email}</p> :
                        <>
                            <Tabs value={tabID} onChange={handleChange} aria-label='login tabs'>
                                <Tab value='login' label={loginDialog.loginTab.title} />
                                <Tab value='register' label={loginDialog.registerTab.title} />
                            </Tabs>
                            <TabPanel value={tabID} index='login'><LoginTab /></TabPanel>
                            <TabPanel value={tabID} index='register'><RegisterTab /></TabPanel>
                        </>
                    }

                </Box>
            </DialogContent>

        </Dialog>
    );
};

export default LoginDialog;