import React, { useContext } from 'react';
import Head from 'next/head';
import { LanguageContext } from '../components/context/LanguageContext';
import ImageLoader from '../components/controls/ImageLoader';
import CenterBox from '../components/controls/CenterBox';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import ExpandableItems from '../components/ExpandableItems';

const Features = () => {

    const imageUrl = process.env.NEXT_PUBLIC_WEB_URL + '/images/';

    const { language } = useContext(LanguageContext);
    const { settings, featuresPage } = language;

    const titles = [featuresPage.multiUserCapability, featuresPage.multilingualCapability,
    featuresPage.easyAccess, featuresPage.realTimeService, featuresPage.ManagementAndSupport];
    const descriptions = [featuresPage.multiUserDescription, featuresPage.multilingualDescription,
    featuresPage.easyAccessDescription, featuresPage.realTimeServiceDescription, featuresPage.ManagementAndSupportDescription];
    const images = ['multiUser.svg', 'multilingual.svg', 'easyAccess.svg', 'realTimeTaxi.svg', 'team.svg'];

    return (
        <>
            <Head>
                <title>{featuresPage.title}</title>
            </Head>
            <Paper sx={{ direction: settings.direction, width: 'min(90vw, 100ch,500px)' }}>

                <List>
                    {titles.map((title, index) =>
                        <ExpandableItems key={index} label={title} isOpen={false} ignoreDivider={index === titles.length - 1}>
                            <CenterBox>
                                <ImageLoader src={imageUrl + images[index]} alt={title} width={200} height={200} />
                                <Typography variant='body1'>
                                    {descriptions[index]}
                                </Typography>
                            </CenterBox>
                        </ExpandableItems>

                    )}
                </List>
            </Paper>

        </>
    );
};

export default Features;