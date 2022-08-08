import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoginTab from './tabs/LoginTab';
import React, { useContext, useState } from 'react';
import RegisterTab from './tabs/RegisterTab';
import Tab from '@mui/material/Tab';
import TabPanel from '../controls/TabPanel';
import Tabs from '@mui/material/Tabs';
import UserInformationTab from './tabs/UserInformationTab';
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
                    {session ?
                        <UserInformationTab />
                        :
                        <>
                            <Tabs value={tabID} onChange={handleChange} aria-label='login tabs'>
                                <Tab value='login' label={loginDialog.loginTab.title} />
                                <Tab value='register' label={loginDialog.registerTab.title} />
                            </Tabs>
                            <TabPanel activeIndex={tabID} index='login'><LoginTab /></TabPanel>
                            <TabPanel activeIndex={tabID} index='register'><RegisterTab /></TabPanel>
                        </>
                    }
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;