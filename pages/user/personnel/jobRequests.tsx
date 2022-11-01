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
import { JobRequest } from '../../../types/job-request';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { ToastContext } from '../../../components/context/ToastContext';
import { getData } from '../../../lib/axiosRequest';
import { useContext, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/system';



const JobRequests: NextPage = () => {

    const { setToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext);

    const [jobRequests, setJobRequests] = useState<JobRequest[] | undefined>(undefined);
    const { jobRequestsPage, settings, components } = language;
    const { dataGrid } = components;
    const [loadingText, setLoadingText] = useState(jobRequestsPage.loading);
    const [reload, setReload] = useState(false);

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
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
        { field: 'agencyName', headerName: jobRequestsPage.agencyName, sortable: true, flex: 1 },
        { field: 'statusLabel', headerName: jobRequestsPage.status, sortable: true, flex: 1 },
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

    return (
        <AuthorizedLayout>
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
                                    <Box sx={{
                                        height: 400, width: '100%', minWidth: '100ch',
                                        '& .selected-theme-1': {
                                            bgcolor: sendedColor,
                                        },
                                        '& .selected-theme-2': {
                                            bgcolor: acceptedColor,
                                        }
                                    }}>
                                        <DataGrid
                                            rows={rowsWithLabel}
                                            columns={columns}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            checkboxSelection
                                            disableSelectionOnClick
                                            disableColumnMenu
                                            getRowClassName={(param) => `selected-theme-${param.row.status}`}
                                            localeText={{
                                                noRowsLabel: dataGrid.noData,
                                                footerRowSelected: (count: number) => `${count} ${count > 1 ? dataGrid.rowsSelected : dataGrid.rowSelected}`,
                                                footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} ${dataGrid.of} ${totalCount.toLocaleString()}`,
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained' color='primary' onClick={() => setReload(true)} >{jobRequestsPage.reload}</Button>
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