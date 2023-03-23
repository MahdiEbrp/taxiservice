import Alert from '@mui/material/Alert';
import AuthorizedLayout from '../../../components/AuthorizedLayout';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../../components/controls/CenterBox';
import DataGridView from '../../../components/controls/DataGridView';
import Head from 'next/head';
import IconButton from '@mui/material/IconButton';
import Loader from '../../../components/controls/Loader';
import Paper from '@mui/material/Paper';
import TabPanel from '../../../components/controls/TabPanel';
import Tooltip from '@mui/material/Tooltip';
import UpdateTripRequest from '../../../components/pageTabs/acceptTripTab/UpdateTripRequest';
import dateCounter, { customCalender } from '../../../lib/dateFormat';
import type { NextPage } from 'next';
import { AccountType } from '../../../types/accountType';
import { GrView } from 'react-icons/gr';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { HiCheckCircle } from 'react-icons/hi';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { MdCancel } from 'react-icons/md';
import { Trip } from '../../../types/trips';
import { getData } from '../../../lib/axiosRequest';
import { useContext, useEffect, useState } from 'react';
import { PriceList } from '../../../types/priceType';

const AcceptTrip: NextPage = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { language } = useContext(LanguageContext);

    const [tripRequests, setTripRequests] = useState<Trip[] | undefined>(undefined);
    const [selectedRow, setSelectedRow] = useState<Trip | undefined>(undefined);
    const [priceList, setPriceList] = useState<PriceList | undefined>(undefined);
    const { acceptTrip, tripRequestsPage, settings } = language;
    const [loadingText, setLoadingText] = useState(tripRequestsPage.receivingTripRequests);
    const [reload, setReload] = useState(false);
    const [action, setAction] = useState('');
    const [activeTab, setActiveTab] = useState('selectTrip');
    useEffect(() => {
        if (!tripRequests || reload) {
            const getDataAsync = async () => {
                setLoadingText(tripRequestsPage.receivingTripRequests);
                const response = await getData(publicUrl + '/api/personel/getTripRequests');
                setLoadingText('');
                setReload(false);
                setActiveTab('selectTrip');
                if (response && response.status === 200) {
                    const { detailedTrips, priceList } = response.data;
                    setTripRequests(detailedTrips as Trip[]);
                    setPriceList(priceList);
                }
            };
            getDataAsync();
        }
    }, [tripRequests, tripRequestsPage.receivingTripRequests, publicUrl, reload]);
    const CellWithTooltip = (params: GridRenderCellParams<string>) => {
        return (
            <Tooltip title={params.value}>
                <span className='overflowSpan'>{params.value}</span>
            </Tooltip>
        );
    };
    const columns: GridColDef[] = [
        { field: 'agencyName', headerName: tripRequestsPage.agencyName, sortable: true, renderCell: CellWithTooltip },
        {
            field: 'acceptCell', headerName: '', sortable: false, width: 130,
            renderCell: () =>
                <>
                    <Tooltip title={acceptTrip.view}>
                        <IconButton onClick={() => updateAction('view')} >
                            <GrView className='reactIcon' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={acceptTrip.accept} onClick={() => updateAction('accept')}>
                        <IconButton>
                            <HiCheckCircle />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={acceptTrip.cancel} onClick={() => updateAction('cancel')}>
                        <IconButton>
                            <MdCancel />
                        </IconButton>
                    </Tooltip>
                </>

        },
        { field: 'statusLabel', headerName: tripRequestsPage.status, sortable: true, renderCell: CellWithTooltip },
        {
            field: 'startDateTime',
            headerName: tripRequestsPage.creationDate,
            sortable: true,
            renderCell: (params: GridRenderCellParams<Date>) =>
                <>
                    {params.value &&
                        <Tooltip title={customCalender(params.value, settings.code)}>
                            <span className='overflowSpan'>{dateCounter(params.value, settings.code)}</span>
                        </Tooltip>
                    }
                </>
            ,
        },
        { field: 'originAddress', headerName: tripRequestsPage.originAddress, sortable: true, renderCell: CellWithTooltip },
        { field: 'destinationAddress', headerName: tripRequestsPage.destinationAddress, sortable: true, renderCell: CellWithTooltip },
        { field: 'subscriberID', headerName: tripRequestsPage.subscriberID, sortable: true, renderCell: CellWithTooltip },
        { field: 'description', headerName: tripRequestsPage.description, sortable: true, renderCell: CellWithTooltip },
    ];
    const updateAction = (action: 'view' | 'accept' | 'cancel') => {
        setAction(action);
        setActiveTab('actionTab');
    };
    const statusToString = (status: number) => {
        const statusNames = [tripRequestsPage.sent, tripRequestsPage.accepted, tripRequestsPage.rejectedByUser, tripRequestsPage.rejectedByAgency];
        return statusNames[status] || tripRequestsPage.undefined;
    };
    const rows = tripRequests?.map((jr) => {
        return {
            statusLabel: statusToString(jr.status),
            ...jr
        };
    });
    const rowsWithLabel = JSON.parse(JSON.stringify(rows || []));

    return (
        <AuthorizedLayout role={AccountType.personnel}>
            <>
                <Head>
                    <title>{acceptTrip.title}</title>
                </Head>
                <CenterBox dir={settings.direction}>
                    {loadingText !== '' ?
                        <>
                            <Paper>
                                <Loader text={loadingText} />
                            </Paper>
                        </>
                        :
                        <>
                            <Card dir={settings.direction}>
                                <CardHeader title={acceptTrip.title} />
                                <CardContent>
                                    <TabPanel index='selectTrip' activeIndex={activeTab}>
                                        <CenterBox >
                                            <Alert severity='info'>
                                                {tripRequestsPage.pageInfo}
                                            </Alert>
                                            <DataGridView
                                                rows={rowsWithLabel}
                                                columns={columns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5]}
                                                disableColumnMenu
                                                onSelectionModelChange={(newSelection) => {
                                                    const selectedRow = rows?.find((r) => newSelection.includes(r.id));
                                                    setSelectedRow(selectedRow);
                                                }}
                                            />
                                        </CenterBox>
                                    </TabPanel>
                                    <TabPanel index='actionTab' activeIndex={activeTab}>

                                        {selectedRow &&
                                            <UpdateTripRequest showTabs={activeTab === 'actionTab'} trip={selectedRow} action={action} onReselect={() => setActiveTab('selectTrip')}
                                        onUpdate={(trips) => setTripRequests(trips)} priceList={priceList} />
                                        }
                                    </TabPanel>
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained' color='primary' onClick={() => setReload(true)} >{acceptTrip.reload}</Button>
                                </CardActions>
                            </Card>
                        </>
                    }
                </CenterBox>
            </>
        </AuthorizedLayout >
    );
};

export default AcceptTrip;