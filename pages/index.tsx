import {  Button, Card, CardActions, CardContent, Paper, Step, StepLabel, Stepper } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { RiEmotionHappyLine } from 'react-icons/ri';

const Home: NextPage = () => {
  return (
    <>
        <Head>
          <title>Home Page</title>
        </Head>
        <Card sx={{ display: 'flex', flex: '1', justifyContent: 'center', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ margin: '5px' }}>

            <CardContent>

              <Stepper activeStep={1} alternativeLabel >

                <Step >
                  <StepLabel icon={<><RiEmotionHappyLine style={{ fontSize: 'x-large' }} /></>}>How can I help you?</StepLabel>
                </Step>

                <Step >
                  <StepLabel icon={<><RiEmotionHappyLine /></>}>How can I help you?</StepLabel>
                </Step>
              </Stepper>
            </CardContent>
            <CardActions>
              <Button size='small'>Next Step</Button>
            </CardActions>
          </Paper>
        </Card>
    </>
  );
};

export default Home;
