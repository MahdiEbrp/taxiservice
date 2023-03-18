import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import DataGridView from '../../controls/DataGridView';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import React, { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import dateCounter from '../../../lib/dateFormat';
import dynamic from 'next/dynamic';
import { GrView } from 'react-icons/gr';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { LanguageContext } from '../../context/LanguageContext';
import { Trip } from '../../../types/trips';

const Map = dynamic(() => import('../../../components/controls/OpenLayerMap'), { ssr: false });
export type CheckAndChooseProps = {
    onSelectionChange: (text: Trip[] | []) => void;
    items: Trip[] | undefined;
};
const CheckAndChooseTab = (props: CheckAndChooseProps) => {


    const { onSelectionChange, items } = props;
    const { language } = useContext(LanguageContext);
    const { commissionPage, settings } = language;
    const [open, setOpen] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState<Trip | undefined>(undefined);

    const showDialog = (selectedRow: Trip | undefined) => {
        if (!selectedRow)
            return;
        setSelectedRowDetails(selectedRow);
        setOpen(true);
    };
    const columns: GridColDef[] = [
        { field: 'agencyName', headerName: commissionPage.agencyName, sortable: true },
        {
            field: 'startDateTime',
            headerName: commissionPage.creationDate,
            sortable: true,
            renderCell: (params: GridRenderCellParams<Date>) =>
                <>
                    {params.value &&
                        <>
                            {dateCounter(params.value, settings.code)}
                        </>
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
        { field: 'totalPrice', headerName: commissionPage.totalPrice, sortable: true },
        { field: 'receivedCommission', headerName: commissionPage.receivedCommission, sortable: true },
        { field: 'subscriberID', headerName: commissionPage.subscriberID, sortable: true },
        { field: 'description', headerName: commissionPage.description, sortable: true },
    ];

    const rows = items?.map((item) => {
        return {
            totalPrice: item.price.toLocaleString(settings.code),
            receivedCommission: item.commission.toLocaleString(settings.code),
            ...item
        };
    });
    const AddressDialog = () => {
        const handleClose = () => {
            setOpen(false);
        };
        const OriginMarker = { location: [selectedRowDetails?.originLatitude || 0, selectedRowDetails?.originLongitude || 0], text: commissionPage.originAddress };

        const destinationMarker = { location: [selectedRowDetails?.destinationLatitude || 0, selectedRowDetails?.destinationLongitude || 0], text: commissionPage.destinationAddress };

        return (
            <>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='commissionPage-dialog-title'
                    aria-describedby='commissionPage-dialog-description'
                >
                    <DialogTitle id='commissionPage-dialog-title'>{commissionPage.addressInfo}</DialogTitle>
                    <DialogContent id='commissionPage-dialog-description' dir={settings.direction}>
                        {selectedRowDetails &&
                            <CenterBox>
                                <Map currentLocation={[selectedRowDetails.destinationLatitude, selectedRowDetails.destinationLongitude]}
                                    markers={[OriginMarker, destinationMarker]}
                                    onLocationChanged={() => void 0} />
                                <Typography variant='body1'>{`${commissionPage.originAddress} : ${selectedRowDetails.originAddress}`}</Typography>
                                <Typography variant='body1'>{`${commissionPage.destinationAddress} : ${selectedRowDetails.destinationAddress}`}</Typography>

                            </CenterBox>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='primary' autoFocus>
                            {commissionPage.close}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };
    return (
        <>
            <Alert severity='info'>
                {commissionPage.pageInfo}
            </Alert>
            <DataGridView
                rows={rows || []}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                disableColumnMenu
                onSelectionModelChange={(newSelection) => {
                    const selectedRow = items?.filter((r) => newSelection.includes(r.id)) || [];
                    onSelectionChange(selectedRow);
                }}
            />
            <AddressDialog />

        </>
    );
};

export default CheckAndChooseTab;