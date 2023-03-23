import AuthorizedLayout from '../components/AuthorizedLayout';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../components/controls/CenterBox';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { AccountType } from '../types/accountType';
import { AllSettingsContext } from '../components/context/AllSettingsContext';
import { LanguageContext } from '../components/context/LanguageContext';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import { CardMedia } from '@mui/material';
import ImageLoader from '../components/controls/ImageLoader';
import TabPanel from '../components/controls/TabPanel';
import { LoginDialogContext } from '../components/context/LoginDialogContext';
import AutoCompletePlus, { TaggedItem } from '../components/controls/AutoCompletePlus';
import dynamic from 'next/dynamic';
import Link from '@mui/material/Link';
import { AgencyData, AgencyDataList } from '../types/agencies';
import { getData } from '../lib/axiosRequest';
import Loader from '../components/controls/Loader';

const Map = dynamic(() => import('../components/controls/OpenLayerMap'), { ssr: false });

const ParentLayout = (props: { status: string, children: ReactElement; }) => {

  const { children, status } = props;
  if (status === 'unauthenticated') {
    return (
      <>
        {children}
      </>
    );
  }
  else {
    return (
      <AuthorizedLayout role={AccountType.customer} >
        {children}
      </AuthorizedLayout>
    );
  }

};
const Home: NextPage = () => {

  const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
  const profilePictureUrl = publicUrl + '/images/profiles/';

  const session = useSession();

  const { userSettings } = useContext(AllSettingsContext);
  const { language } = useContext(LanguageContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);

  const { homePage, settings } = language;

  const [name, setName] = useState(homePage.guest);
  const [activeIndex, setActiveIndex] = useState('0');
  const [loadingText, setLoadingText] = useState('');
  const [reload, setReload] = useState(true);
  const [agencies, setAgencies] = useState<AgencyDataList | undefined>(undefined);
  const [selectedAgency, setSelectedAgency] = useState<AgencyData | null>(null);

  if (userSettings && userSettings.name !== name)
    setName(userSettings.name);
  useEffect(() => {
    if (userSettings && userSettings.name !== name) {
      setName(userSettings.name);
      return;
    }
    if (name !== homePage.guest)
      setName(homePage.guest);

  }, [homePage.guest, name, userSettings]);
  const isCustomer = useMemo(() => {
    if (!userSettings)
      return true;
    else
      return userSettings.accountType === 0;
  }, [userSettings]);
  useEffect(() => {
    if (!agencies || reload) {
      const getDataAsync = async () => {
        setLoadingText(homePage.receivingData);
        const response = await getData(publicUrl + '/api/agency/unauthorizedRetrieve');
        setLoadingText('');
        setReload(false);
        if (response && response.status === 200) {
          setAgencies(response.data as AgencyDataList);
        }
      };
      getDataAsync();
    }
  }, [agencies, publicUrl, reload, homePage.receivingData]);
  const agencyNames = agencies?.map((agency) => {
    return {
      displayText: agency.agencyName,
      tag: agency.id
    };
  });

  const handleAgencyChange = (item: TaggedItem<string> | null) => {
    if (!item || !agencies) {
      setSelectedAgency(null);
      return;
    }
    const selectAgency = agencies.find((agency) => agency.id === item.tag) ?? null;
    setSelectedAgency(selectAgency);
  };

  return (
    <ParentLayout status={session.status}>
      <>
        <Head>
          <title>{homePage.title}</title>
        </Head>
        <Card>
          <CardHeader title={homePage.welcome} />
          {!userSettings && activeIndex === '0' &&
            <CardMedia>
              <ImageLoader src='/images/home.svg' alt={homePage.thanks} width={300} height={300} />
            </CardMedia>
          }
          <CardContent sx={{ direction: settings.direction, width: 'min(90vw, 100ch,500px)' }}>
            <TabPanel activeIndex={activeIndex} index='0'>
              {userSettings && userSettings.profilePicture &&
                <Avatar sx={{ width: 100, height: 100 }} src={profilePictureUrl + userSettings.profilePicture} />
              }
              <Typography variant='body1' component='p'>
                {homePage.fullWelcome.replace('$USERNAME', name)}
              </Typography>
              <Typography variant='body1' component='p'>
                {homePage.thanks}
              </Typography>
              {isCustomer &&
                <Typography variant='body1' component='p'>
                  {homePage.professionalDrivers}
                </Typography>
              }
            </TabPanel>
            <TabPanel activeIndex={activeIndex} index='1' >
              {loadingText ?
                <Loader text={loadingText} />
                :
                <>
                  <AutoCompletePlus label={homePage.selectAgency} items={agencyNames}
                    onChanged={handleAgencyChange} />
                  {selectedAgency &&
                    <CenterBox>
                      <Typography variant='h6'>
                        {`${homePage.agencyName}:${selectedAgency.agencyName}`}
                      </Typography>
                      <Typography variant='body1'>
                        <Link href={`tell:${selectedAgency.phoneNumber1}`}>
                          {`${homePage.phoneNumber1} : ${selectedAgency.phoneNumber1}`}
                        </Link>
                        {selectedAgency.phoneNumber2 &&
                          <Link href={`tell:${selectedAgency.phoneNumber2}`}>
                            {`${homePage.phoneNumber2} : ${selectedAgency.phoneNumber2}`}
                          </Link>
                        }
                      </Typography>
                      <Typography variant='body2'>
                        {`${homePage.address} : ${selectedAgency.address}`}
                      </Typography>
                      <Map currentLocation={[selectedAgency.latitude, selectedAgency.longitude]} onLocationChanged={() => void 0} />
                    </CenterBox>
                  }
                  <Button onClick={() => setReload(true)} >{homePage.reload}</Button>
                </>
              }
            </TabPanel>
          </CardContent>
          <CardActions sx={{ direction: settings.direction, justifyContent: 'space-between' }}>
            {!userSettings &&
              <Button variant='contained' color='primary' onClick={() => setLoginDialogOpen(true)} >{homePage.login}</Button>
            }
            {activeIndex === '0' &&
              <Button variant='contained' color='primary' onClick={() => setActiveIndex('1')}>{homePage.viewActiveAgencies}</Button>
            }
            {activeIndex === '1' &&
              <Button variant='contained' color='primary' onClick={() => setActiveIndex('0')}>{homePage.back}</Button>
            }

          </CardActions>
        </Card>
      </>
    </ParentLayout>
  );
};

export default Home;
