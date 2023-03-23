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
import dateCounter, { customCalender } from '../../../lib/dateFormat';
import type { NextPage } from 'next';
import { AccountType } from '../../../types/accountType';
import { GrView } from 'react-icons/gr';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { Trip } from '../../../types/trips';
import { getData } from '../../../lib/axiosRequest';
import { useContext, useEffect, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import ChangeTripStatus from '../../../components/pageTabs/changeTripTab/changeStatusTab';

const ChangeStatus: NextPage = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { language } = useContext(LanguageContext);

    const [tripRequests, setTripRequests] = useState<Trip[] | undefined>(undefined);
    const [selectedRow, setSelectedRow] = useState<Trip | undefined>(undefined);
    const { changeStatus, tripRequestsPage, settings } = language;
    const [loadingText, setLoadingText] = useState(tripRequestsPage.receivingTripRequests);
    const [reload, setReload] = useState(false);
    const [action, setAction] = useState('');
    const [activeTab, setActiveTab] = useState('selectTrip');
    useEffect(() => {
        if (!tripRequests || reload) {
            const getDataAsync = async () => {
                setLoadingText(tripRequestsPage.receivingTripRequests);
                const response = await getData(publicUrl + '/api/trips/getSuitedTrip');
                setLoadingText('');
                setReload(false);
                setActiveTab('selectTrip');
                if (response && response.status === 200) {
                    setTripRequests(response.data as Trip[]);
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
            field: 'acceptCell', headerName: '', sortable: false, width: 100,
            renderCell: () =>
                <>
                    <Tooltip title={changeStatus.view}>
                        <IconButton onClick={() => updateAction('view')} >
                            <GrView className='reactIcon' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={changeStatus.modify} onClick={() => updateAction('modify')}>
                        <IconButton>
                            <TbEdit />
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
    const updateAction = (action: 'view' | 'modify') => {
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
                    <title>{changeStatus.title}</title>
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
                                <CardHeader title={changeStatus.title} />
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
                                            <>
                                                <ChangeTripStatus action={action} trip={selectedRow} onReselect={() => setActiveTab('selectTrip')}
                                                    onUpdate={() => void 0} />
                                            </>
                                        }
                                    </TabPanel>
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained' color='primary' onClick={() => setReload(true)} >{changeStatus.reload}</Button>
                                </CardActions>
                            </Card>
                        </>
                    }
                </CenterBox>
            </>
        </AuthorizedLayout >
    );
};

export default ChangeStatus;