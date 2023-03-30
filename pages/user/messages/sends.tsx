import AuthorizedLayout from '../../../components/AuthorizedLayout';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../../components/controls/CenterBox';
import DataGridView from '../../../components/controls/DataGridView';
import Head from 'next/head';
import Loader from '../../../components/controls/Loader';
import React, { useContext, useEffect, useState, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { GridColDef, GridEventListener, GridRenderCellParams } from '@mui/x-data-grid';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { MessageData, MessageDataList } from '../../../types/messages';
import { getData } from '../../../lib/axiosRequest';
import MessageDialog from '../../../components/dialogs/MessageDialog';
import { MessageDialogContext } from '../../../components/context/MessageDialogContext';
import dateCounter, { customCalender } from '../../../lib/dateFormat';
import { getSystemMessage } from '../../../lib/language';
import { AccountType } from '../../../types/accountType';
import Tooltip from '@mui/material/Tooltip';

const Sends: NextPage = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const profilePictureUrl = publicUrl + '/images/profiles/';

    const { language } = useContext(LanguageContext);
    const { setMessageDialogOpen } = useContext(MessageDialogContext);

    const [messages, setMessages] = useState<MessageDataList | undefined>(undefined);
    const [reload, setReload] = useState(false);

    const { sendsPage, inboxPage, settings } = language;

    const [loadingText, setLoadingText] = useState<string>('');
    const [clickedRow, setClickedRow] = useState<MessageData | undefined>(undefined);
    const CellWithTooltip = (params: GridRenderCellParams<string>) => {
        return (
            <Tooltip title={params.value}>
                <span className='overflowSpan'>{params.value}</span>
            </Tooltip>
        );
    };
    const columns: GridColDef[] = [
        {
            field: 'senderProfilePicture',
            headerName: '',
            sortable: false,
            renderCell: (params: GridRenderCellParams<string>) =>
                <>
                    <Avatar src={profilePictureUrl + params.value || ''} sx={{ width: 48, height: 48 }} alt='profile picture' />
                </>
            ,
        },
        { field: 'sender', headerName: inboxPage.sender, sortable: true, renderCell: CellWithTooltip },
        {
            field: 'isRead',
            headerName: inboxPage.viewed,
            sortable: true,
            renderCell: (params: GridRenderCellParams<boolean>) =>
                <>
                    {params.value ?
                        <>
                            <IoCheckmarkDone style={{ margin: '1rem' }} />
                            {inboxPage.yes}
                        </>
                        :
                        <>
                            <IoCheckmark style={{ margin: '1rem' }} />
                            {inboxPage.no}

                        </>
                    }
                </>
            ,
        },
        { field: 'title', headerName: inboxPage.messageTitle, sortable: true, renderCell: CellWithTooltip },
        {
            field: 'date',
            headerName: inboxPage.date,
            sortable: true,
            flex: 1,
            minWidth: 150,
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

    ];
    useEffect(() => {
        if (!messages || reload) {
            const getDataAsync = async () => {
                setLoadingText(inboxPage.receivingMessages);
                const response = await getData(publicUrl + '/api/messages/sends');
                setLoadingText('');
                setReload(false);
                if (response && response.status === 200) {
                    setMessages(response.data as MessageDataList);
                }
            };
            getDataAsync();
        }
    }, [inboxPage.receivingMessages, messages, publicUrl, reload]);
    const handleEvent: GridEventListener<'rowClick'> = (params) => {
        const row = params.row as MessageData;
        if (row) {
            setClickedRow(row);
            setMessageDialogOpen(true);
        }
        else
            setClickedRow(undefined);
    };
    const rows = useMemo(() => messages?.map((message) => {
        return {
            id: message.id,
            sender: message.sender,
            title: getSystemMessage(message.title, language),
            message: getSystemMessage(message.message, language),
            date: message.date,
            senderProfilePicture: message.senderProfilePicture,
            isRead: message.isRead,
        };
    }), [messages, language]);

    const rowsWithLabel = JSON.parse(JSON.stringify(rows || []));

    return (
        <AuthorizedLayout role={AccountType.customer}>
            <>
                <Head>
                    <title>{sendsPage.title}</title>
                </Head>
                <Card>
                    <CardHeader title={sendsPage.title} />
                    <CardContent>
                        <CenterBox dir={settings.direction}>
                            {loadingText !== '' ?
                                <Loader text={loadingText} />
                                :
                                <>
                                    {messages ?
                                        <>
                                            <DataGridView
                                                rows={rowsWithLabel}
                                                columns={columns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10]}
                                                disableSelectionOnClick
                                                disableColumnMenu
                                                onRowClick={handleEvent}
                                                sx={{
                                                    '& .MuiDataGrid-row': {
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                            />
                                        </>
                                        :
                                        <Typography variant='body2'>
                                            {inboxPage.noMessages}
                                        </Typography>
                                    }
                                </>

                            }
                        </CenterBox>
                    </CardContent>
                    <CardActions>
                        <Button variant='contained' color='primary' onClick={() => setReload(true)} >
                            {inboxPage.reload}
                        </Button>
                    </CardActions>
                </Card>
                <MessageDialog message={clickedRow} skipRead={true} />
            </>
        </AuthorizedLayout >
    );
};

export default Sends;