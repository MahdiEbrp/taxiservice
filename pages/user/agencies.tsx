import Head from 'next/head';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { Card, CardContent, styled } from '@mui/material';
import { ToastContext } from '../../lib/context/ToastContext';
import { useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const Agencies = () => {
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);
    /* #endregion */
    /* #region Language section */
    const { settings, agenciesPage } = language;
    const { rightToLeft } = settings;
    const { gridColumns } = agenciesPage;
    /* #endregion */

    return (
        <>
            <Head>
                <title>{agenciesPage.title}</title>
            </Head>
        </>
    );
};

export default Agencies;