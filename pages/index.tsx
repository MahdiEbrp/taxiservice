import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@mui/material/CardContent';
import Head from 'next/head';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import type { NextPage } from 'next';
import { RiEmotionHappyLine } from 'react-icons/ri';
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <Card>
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
      </Card>
    </>
  );
};

export default Home;
