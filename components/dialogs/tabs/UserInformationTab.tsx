import CenterBox from '../../controls/CenterBox';
import React, { useState } from 'react';
import { Avatar, Button, Typography } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import {useRouter} from 'next/router';
const UserInformationTab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router=useRouter();
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
        <CenterBox>
            <Avatar sx={{ width: 56, height: 56 }}>E</Avatar>
            <Typography>
                Email:{session?.user?.email}
            </Typography>
            <Button onClick={()=>signOutUser()}>SingOut</Button>
        </CenterBox>
    );
};

export default UserInformationTab;