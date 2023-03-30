import AuthorizedLayout from '../../../components/AuthorizedLayout';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../../components/controls/CenterBox';
import Head from 'next/head';
import Loader from '../../../components/controls/Loader';
import Paper from '@mui/material/Paper';
import type { NextPage } from 'next';
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { JobRequest } from '../../../types/jobRequest';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { ToastContext } from '../../../components/context/ToastContext';
import { getData, postData } from '../../../lib/axiosRequest';
import { useContext, useEffect, useState } from 'react';
import DataGridView from '../../../components/controls/DataGridView';
import { AccountType } from '../../../types/accountType';

const JobRequests: NextPage = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { setToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext);

    const [jobRequests, setJobRequests] = useState<JobRequest[] | undefined>(undefined);
    const [enableRequest, setEnableRequest] = useState(false);
    const [selectedRow, setSelectedRow] = useState<JobRequest[]>([]);
    const { jobRequestsPage, settings, notification } = language;
    const [loadingText, setLoadingText] = useState(jobRequestsPage.loading);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        if (!jobRequests || reload) {
            const getDataAsync = async () => {
                setLoadingText(jobRequestsPage.receivingJobRequests);
                const response = await getData(publicUrl + '/api/personel/getRequests');
                setLoadingText('');
                setReload(false);
                if (response && response.status === 200) {
                    setJobRequests(response.data as JobRequest[]);
                }
            };
            getDataAsync();
        }
    }, [jobRequests, jobRequestsPage.receivingJobRequests, publicUrl, reload]);

    const columns: GridColDef[] = [
        { field: 'agencyName', headerName: jobRequestsPage.agencyName, sortable: true },
        { field: 'statusLabel', headerName: jobRequestsPage.status, sortable: true },
    ];
    const statusToString = (status: number) => {
        switch (status) {
            case 0:
                return jobRequestsPage.notSent;
            case 1:
                return jobRequestsPage.sent;
            case 2:
                return jobRequestsPage.accepted;
            default:
                return jobRequestsPage.notSent;
        }
    };
    const rows = jobRequests?.map((jr) => {
        return {
            id: jr.id,
            agencyName: jr.agencyName,
            status: jr.status,
            statusLabel: statusToString(jr.status),
        };
    });
    const rowsWithLabel = JSON.parse(JSON.stringify(rows || []));
    const sendedColor = '#0012eb2b';
    const acceptedColor = '#04ff232e';
    const handleRequest = async (insertMode: boolean) => {
        if (!selectedRow || selectedRow.length === 0) {
            setToast({ id: Math.random(), message: notification.unselectedRow, alertColor: 'error' });
            return;
        }
        const selectedRowByStatus = selectedRow.filter((jr) => jr.status === (insertMode ? 0 : 1));
        if (selectedRowByStatus.length !== selectedRow.length) {
            setToast({
                id: Math.random(), message:
                    insertMode ? notification.chooseOnlyUnsendRequests : notification.chooseOnlySendedRequests,
                alertColor: 'warning'
            });
            return;
        }
        const selectedRowIds = selectedRowByStatus.map((jr) => jr.id);

        setLoadingText(insertMode ? jobRequestsPage.sendingRequests : jobRequestsPage.cancelingRequests);
        const response = await postData(publicUrl + '/api/personel/updateRequests', { ids: selectedRowIds, insertMode: insertMode });
        if (response && response.status === 200) {
            setToast({ id: Math.random(), message: notification.operationSuccess, alertColor: 'success' });
            setJobRequests(response.data as JobRequest[]);
        }
        else
            setJobRequests(undefined);
        setLoadingText('');

    };

    return (
        <AuthorizedLayout role={AccountType.personnel}>
            <>
                <Head>
                    <title>{jobRequestsPage.title}</title>
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
                                <CardHeader title={jobRequestsPage.title} />
                                <CardContent>
                                    <Box >
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
                                            getRowClassName={(param) => `selected-theme-${param.row.status}`}
                                            sx={{
                                                '& .selected-theme-1': {
                                                    bgcolor: sendedColor,
                                                },
                                                '& .selected-theme-2': {
                                                    bgcolor: acceptedColor,
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <CenterBox wrapMode={true}>
                                        <Button variant='contained' color='primary' onClick={() => setReload(true)} >{jobRequestsPage.reload}</Button>
                                        <Button variant='contained' disabled={!enableRequest} color='primary'
                                            onClick={() => handleRequest(true)}  >
                                            {jobRequestsPage.sendRequest}
                                        </Button>
                                        <Button variant='contained' disabled={!enableRequest} color='primary' onClick={() => handleRequest(false)}  >
                                            {jobRequestsPage.cancelRequest}
                                        </Button>
                                    </CenterBox>
                                </CardActions>
                            </Card>
                        </>
                    }
                </CenterBox>
            </>
        </AuthorizedLayout >
    );
};

export default JobRequests;