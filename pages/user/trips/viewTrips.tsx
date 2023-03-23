import Alert from '@mui/material/Alert';
import AuthorizedLayout from '../../../components/AuthorizedLayout';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../../components/controls/CenterBox';
import DataGridView from '../../../components/controls/DataGridView';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Head from 'next/head';
import IconButton from '@mui/material/IconButton';
import Loader from '../../../components/controls/Loader';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import dateCounter, { customCalender } from '../../../lib/dateFormat';
import dynamic from 'next/dynamic';
import type { NextPage } from 'next';
import { AccountType } from '../../../types/accountType';
import { GrView } from 'react-icons/gr';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { ToastContext } from '../../../components/context/ToastContext';
import { Trip } from '../../../types/trips';
import { getData, postData } from '../../../lib/axiosRequest';
import { useContext, useEffect, useState } from 'react';
import { getResponseError } from '../../../lib/language';
import Tooltip from '@mui/material/Tooltip';

const Map = dynamic(() => import('../../../components/controls/OpenLayerMap'), { ssr: false });

const ViewTrips: NextPage = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { setToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext);

    const [tripRequests, setTripRequests] = useState<Trip[] | undefined>(undefined);
    const [enableRequest, setEnableRequest] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Trip[]>([]);
    const { tripRequestsPage, settings, notification } = language;
    const [loadingText, setLoadingText] = useState(tripRequestsPage.receivingTripRequests);
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState<Trip | undefined>(undefined);

    useEffect(() => {
        if (!tripRequests || reload) {
            const getDataAsync = async () => {
                setLoadingText(tripRequestsPage.receivingTripRequests);
                const response = await getData(publicUrl + '/api/trips/getRequests');
                setLoadingText('');
                setReload(false);
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
        { field: 'statusLabel', headerName: tripRequestsPage.status, sortable: true, renderCell: CellWithTooltip },
        {
            field: 'startDateTime',
            headerName: tripRequestsPage.creationDate,
            sortable: true,
            renderCell: (params: GridRenderCellParams<Date>) =>
                <>
                    {params.value &&
                        <Tooltip title={customCalender(params.value,settings.code)}>
                            <span className='overflowSpan'>{dateCounter(params.value, settings.code)}</span>
                        </Tooltip>
                    }
                </>
            ,
        },
        {
            field: 'viewFullAddress',
            headerName: '',
            sortable: false,
            width: 46,
            renderCell: (selectedRow: GridRenderCellParams<Trip>) =>
                <>
                    <IconButton color='primary' onClick={() => showDialog(selectedRow.row)} >
                        <GrView className='reactIcon' />
                    </IconButton>
                </>
        },

        { field: 'originAddress', headerName: tripRequestsPage.originAddress, sortable: true, renderCell: CellWithTooltip },
        { field: 'destinationAddress', headerName: tripRequestsPage.destinationAddress, sortable: true, renderCell: CellWithTooltip },
        { field: 'subscriberID', headerName: tripRequestsPage.subscriberID, sortable: true, renderCell: CellWithTooltip },
        { field: 'description', headerName: tripRequestsPage.description, sortable: true, renderCell: CellWithTooltip },
    ];
    const showDialog = (selectedRow: Trip | undefined) => {
        if (!selectedRow)
            return;
        setSelectedRowDetails(selectedRow);
        setOpen(true);
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

    const handleRequest = async () => {
        if (!selectedRow || selectedRow.length === 0) {
            setToast({ id: Math.random(), message: notification.unselectedRow, alertColor: 'error' });
            return;
        }
        const selectedRowByStatus = selectedRow.filter((jr) => jr.status === 0);
        if (selectedRowByStatus.length !== selectedRow.length) {
            setToast({ id: Math.random(), message: notification.chooseOnlySendedRequests, alertColor: 'warning' });
            return;
        }
        const selectedRowIds = selectedRowByStatus.map((jr) => jr.id);

        setLoadingText(tripRequestsPage.cancelingRequests);
        const response = await postData(publicUrl + '/api/trips/cancelRequest', { ids: selectedRowIds });
        setLoadingText('');

        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response && response.status === 200) {
            setToast({ id: Math.random(), message: notification.operationSuccess, alertColor: 'success' });
            setTripRequests(response.data as Trip[]);
            return;
        }
        const { error } = response.data as { error: string; };
        if (error)
            setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
        else
            setToast({ id: Date.now(), message: getResponseError('HTML_ERROR_' + response.status, language), alertColor: 'error' });

    };
    const AddressDialog = () => {
        const handleClose = () => {
            setOpen(false);
        };
        const OriginMarker = { location: [selectedRowDetails?.originLatitude || 0, selectedRowDetails?.originLongitude || 0], text: tripRequestsPage.originAddress };

        const destinationMarker = { location: [selectedRowDetails?.destinationLatitude || 0, selectedRowDetails?.destinationLongitude || 0], text: tripRequestsPage.destinationAddress };

        return (
            <>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='address-dialog-title'
                    aria-describedby='address-dialog-description'
                >
                    <DialogTitle id='address-dialog-title'>{tripRequestsPage.addressInfo}</DialogTitle>
                    <DialogContent id='address-dialog-description' dir={settings.direction}>
                        {selectedRowDetails &&
                            <CenterBox>
                                <Map currentLocation={[selectedRowDetails.destinationLatitude, selectedRowDetails.destinationLongitude]}
                                    markers={[OriginMarker, destinationMarker]}
                                    onLocationChanged={() => void 0} />
                                <Typography variant='body1'>{`${tripRequestsPage.originAddress} : ${selectedRowDetails.originAddress}`}</Typography>
                                <Typography variant='body1'>{`${tripRequestsPage.destinationAddress} : ${selectedRowDetails.destinationAddress}`}</Typography>

                            </CenterBox>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='primary' autoFocus>
                            {tripRequestsPage.close}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };
    return (
        <AuthorizedLayout role={AccountType.personnel}>
            <>
                <Head>
                    <title>{tripRequestsPage.title}</title>
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
                                <CardHeader title={tripRequestsPage.title} />
                                <CardContent>
                                    <CenterBox >
                                        <Alert severity='info'>
                                            {tripRequestsPage.pageInfo}
                                        </Alert>
                                        <DataGridView
                                            rows={rowsWithLabel}
                                            columns={columns}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            checkboxSelection
                                            disableSelectionOnClick
                                            disableColumnMenu
                                            onSelectionModelChange={(newSelection) => {
                                                const isValid = newSelection.length > 0;
                                                const selectedRow = rows?.filter((r) => newSelection.includes(r.id)) || [];
                                                setSelectedRow(selectedRow);
                                                setEnableRequest(isValid);
                                            }}
                                        />
                                    </CenterBox>
                                </CardContent>
                                <CardActions>
                                    <CenterBox wrapMode={true}>
                                        <Button variant='contained' color='primary' onClick={() => setReload(true)} >{tripRequestsPage.reload}</Button>
                                        <Button variant='contained' disabled={!enableRequest} color='primary' onClick={handleRequest}  >
                                            {tripRequestsPage.cancelRequests}
                                        </Button>
                                    </CenterBox>
                                </CardActions>
                            </Card>
                        </>
                    }
                </CenterBox>
                <AddressDialog />
            </>
        </AuthorizedLayout >
    );
};

export default ViewTrips;