import LoginTab from './tabs/LoginTab';
import React, { useContext, useState } from 'react';
import RegisterTab from './tabs/RegisterTab';
import TabPanel from '../controls/TabPanel';
import UserInformationTab from './tabs/UserInformationTab';
import { Box, Dialog, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { LoginDialogContext } from '../../lib/context/LoginDialogContext';
import { useSession } from 'next-auth/react';
const LoginDialog = () => {
    /* #region Context section */
    const { isLoginDialogOpen, setLoginDialogOpen } = useContext(LoginDialogContext);
    const { language } = useContext(LanguageContext);
    /* #endregion */
    const [tabID, setTabId] = useState('login');
    const { data: session } = useSession();
    /* #region Language section */
    const { direction } = language.settings;
    const loginDialog = language.loginDialog;
    /* #endregion */
    /* #region Functions sections */
    const handleClose = () => {
        setLoginDialogOpen(false);
    };
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabId(newValue);
    };
    /* #endregion */
    return (
        <Dialog
            open={isLoginDialogOpen}
            onClose={handleClose}
            aria-labelledby='language-dialog-title'
            aria-describedby='language-dialog-description'
            dir={direction}
        >
            <DialogTitle id='language-dialog-title'>
                {!session ? loginDialog.title : loginDialog.userInformation.title}
            </DialogTitle>
            <DialogContent >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    {session?
                        <UserInformationTab />
                        :
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