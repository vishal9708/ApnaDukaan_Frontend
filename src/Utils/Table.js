import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Box, Checkbox, Grid } from '@mui/material';


export default function ScrollingTable({ rows, columns, checkedRows, handleCheckboxClick }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    ////console.log("rows", rows)


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 13,
            padding: '.5rem 0 .5rem 0 '
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: '#F4F9FF',
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (

        <Box sx={{
            bgcolor: "#fff",
            boxShadow: 4,
            marginTop: "20px",
            borderRadius: '8px',
            alignItems: "center",
            height: "auto",
            width: "80%",
            margin: "auto",
            marginBottom: "1rem"
        }}>

            <Paper sx={{ width: window.innerWidth <= 390 ? '87%' : '100%', overflow: "hidden", margin: '.0rem', }}>
                <TableContainer sx={{
                    maxHeight: 265, borderBottom: 'none',
                    "&::-webkit-scrollbar": {
                        width: 0
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#dee6f2"
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#2057a6",
                        borderRadius: 2
                    }
                }}>
                    <Table stickyHeader aria-label="customized table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell
                                    key={"column.id"}
                                    align={'left'}
                                    style={{ minWidth: "80", color: "#fff", backgroundColor: "#98a0a6", fontSize: "16px", fontWeight: 700 }}
                                >
                                    {"Select"}
                                </StyledTableCell>
                                {columns.map((column) => (
                                    <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, color: column.color, backgroundColor: "#98a0a6", fontSize: "16px", fontWeight: 700 }}
                                    >
                                        {column.label}
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length > 0 ? (
                                rows.map((row, rowkey) => (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={rowkey}>
                                        <StyledTableCell key={"0"} align={"left"}>
                                            <Checkbox
                                                style={{ paddingLeft: "1.2rem" }}
                                                checked={checkedRows.includes(rowkey)}
                                                onClick={() => handleCheckboxClick(rowkey)}
                                            />
                                        </StyledTableCell>
                                        {columns.map((column) => {
                                            let value = row[column.id];
                                            return (
                                                <StyledTableCell key={column.id} align={column.align}>
                                                    {value}
                                                </StyledTableCell>
                                            );
                                        })}
                                    </StyledTableRow>
                                ))
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={columns.length + 1} align="center">
                                        <p style={{ textAlign: 'center', fontSize: "14px", margin: '0 auto', maxWidth: "500px" }}>
                                        Either you submitted demat account details to us or you don't have any folio under this mode of holding
                                        </p>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}