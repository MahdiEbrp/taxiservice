import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useContext } from 'react';
import { LanguageContext } from '../../components/context/LanguageContext';
import AuthorizedLayout from '../../components/AuthorizedLayout';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import ImageList from '@mui/material/ImageList';
import CenterBox from '../../components/controls/CenterBox';
import ImageListItem from '@mui/material/ImageListItem';
import ImageLoader from '../../components/controls/ImageLoader';
import ButtonBase from '@mui/material/ButtonBase';

const Settings: NextPage = () => {

    const { language } = useContext(LanguageContext);
    const { settingsPage, settings } = language;

    const fullNameChanged = (value: string) => {
        console.log(value);
    };
    const images = Array.from(Array(50).keys()).map((i) => `profile${i}.svg`);
    // create a opacity transition from 0.9 to 1

    return (
        <AuthorizedLayout>
            <>
                <Head>
                    <title>{settingsPage.title}</title>
                </Head>
                <Card dir={settings.direction}>
                    <CardHeader title={settingsPage.title} />
                    <CardContent>
                        <CenterBox>
                            <TextField sx={{ width: 'min(70vw, 300px)' }} label={settingsPage.fullName} onBlur={(e) => fullNameChanged(e.target.value)}
                                inputProps={{ maxLength: 300 }} helperText={settingsPage.fullNameDescription} />
                            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                                {images.map((item) =>
                                    //sx = {{ opacity: 0.9 }} transition = {transition} hover = {{ opacity: 1 }}
                                    <ImageListItem key={item} sx={{
                                        opacity: 0.8,
                                        cursor: 'pointer',
                                        transition: 'opacity 0.5s',
                                        '&:hover': {
                                            opacity: 1,
                                        },
                                    }}>
                                        <ButtonBase component='span'>
                                            <ImageLoader src={`${process.env.NEXT_PUBLIC_WEB_URL}/images/profiles/${item}`} alt={item} width={164} height={164} >
                                                </ImageLoader>
                                        </ButtonBase>
                                    </ImageListItem>
                                )}
                            </ImageList>
                        </CenterBox>
                    </CardContent>

                </Card>
            </>
        </AuthorizedLayout>
    );
};

export default Settings;