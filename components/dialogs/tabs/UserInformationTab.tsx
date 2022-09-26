import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loader from '../../controls/Loader';
const UserInformationTab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const redirect = async () => {
        setIsLoading(true);
        await router.push('/');
        setIsLoading(false);

    };
    if (!session)
        redirect();
    const signOutUser = async () => {
        setIsLoading(true);
        const response = await signOut({ redirect: false });
        if (response)
            redirect();
    };
    return (
        <>
            {
                isLoading ?
                    <Loader text='Signing out...' />
                    :
                    <CenterBox>
                        <Avatar sx={{ width: 100, height: 100 }} />
                        <Typography variant='body2'>{session?.user?.email}</Typography>
                        <Button variant='contained' onClick={signOutUser}>Sign out</Button>
                    </CenterBox>
            }
        </>
    );
};

export default UserInformationTab;