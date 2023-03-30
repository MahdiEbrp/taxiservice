
import Box from '@mui/material/Box';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { ElementType, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { SxProps, Theme } from '@mui/material';

const DataGridView: ElementType<DataGridProps> = (props: DataGridProps) => {

    const { ...other } = props;
    const newProps = { ...other };
    const { language } = useContext(LanguageContext);

    const { components,settings } = language;
    const { dataGrid } = components;

    const fixDataGridViewRtlBug = () => {
        if (settings.direction === 'ltr') return newProps.sx;

        return {
            ...newProps.sx,
            '& .MuiDataGrid-columnHeaders': {
                transform: 'rotateY(180deg)',
            },
            '& .MuiDataGrid-cell': {
                transform: 'rotateY(180deg)',
                direction: 'rtl',

            },
            '& .MuiDataGrid-columnHeaderTitleContainer': {
                transform: 'rotateY(180deg)',
                direction: 'rtl',

            },
            '& .MuiDataGrid-virtualScroller': {
                transform: 'rotateY(180deg)',
            },
            '& .MuiDataGrid-footerContainer': {
                direction: 'rtl',
            }
        } as SxProps<Theme>;
    };


    return (
        <Box dir='ltr' sx={{ height: 400, width: 'min(90vw, 100ch)', minWidth: 'min(90vw, 100ch)' }}>

            <DataGrid
                {...newProps}
                sx={fixDataGridViewRtlBug()}
                localeText={{
                    noRowsLabel: dataGrid.noData,
                    footerRowSelected: (count: number) => `${count} ${count > 1 ? dataGrid.rowsSelected : dataGrid.rowSelected}`,
                    footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} ${dataGrid.of} ${totalCount.toLocaleString()}`,
                }}
            />
        </Box>
    );
};

export default DataGridView;