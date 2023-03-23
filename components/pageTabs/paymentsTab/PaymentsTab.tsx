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
import { ExtendedTrip } from '../../../types/trips';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';

const Map = dynamic(() => import('../../../components/controls/OpenLayerMap'), { ssr: false });
export type PaymentsProps = {
    onSelectionChange: (text: ExtendedTrip[] | []) => void;
    items: ExtendedTrip[] | undefined;
};
const PaymentsTab = (props: PaymentsProps) => {


    const { onSelectionChange, items } = props;
    const { language } = useContext(LanguageContext);
    const { paymentsPage, commissionPage, settings } = language;
    const [open, setOpen] = useState(false);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const [selectedRowDetails, setSelectedRowDetails] = useState<ExtendedTrip | undefined>(undefined);

    const showDialog = (selectedRow: ExtendedTrip | undefined) => {
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
            renderCell: (selectedRow: GridRenderCellParams<ExtendedTrip>) =>
                <>
                    <IconButton color='primary' onClick={() => showDialog(selectedRow.row)} >
                        <GrView className='reactIcon' />
                    </IconButton>
                </>
        },
        { field: 'totalCost', headerName: paymentsPage.cost, sortable: true },
        { field: 'totalIncome', headerName: paymentsPage.income, sortable: true },
        { field: 'subscriberID', headerName: commissionPage.subscriberID, sortable: true },
        { field: 'description', headerName: commissionPage.description, sortable: true },
    ];

    const rows = items?.map((item) => {
        return {
            totalCost: item.cost.toLocaleString(settings.code) + localizationInfo.currency,
            totalIncome: item.income.toLocaleString(settings.code) + localizationInfo.currency,
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
                    aria-labelledby='paymentsPage-dialog-title'
                    aria-describedby='paymentsPage-dialog-description'
                >
                    <DialogTitle id='paymentsPage-dialog-title'>{commissionPage.addressInfo}</DialogTitle>
                    <DialogContent id='paymentsPage-dialog-description' dir={settings.direction}>
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

export default PaymentsTab;