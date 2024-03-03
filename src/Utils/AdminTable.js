import React, { useState, useEffect } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import InputLabel from '@mui/material/InputLabel';
import { Box, Button, Checkbox, Grid, TablePagination } from '@mui/material';
import downloadBtn from "../Assets/images/download-button.png"
import DoneIcon from '@mui/icons-material/Done';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { encrypt, decrypt } from "../Utils/encryption";
import SelectSmall from "./Dropdown";
import axios from "axios";
import SecureLS from "secure-ls";
import Swal from "sweetalert2";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import swal from "sweetalert";
/* Helper function */
function download_file(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        var filename = fileURL.substring(fileURL.lastIndexOf('/') + 1);
        save.download = fileName || filename;
        if (navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
            document.location = save.href;
            // window event not working here
        } else {
            var evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            save.dispatchEvent(evt);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }
    }

    // for IE < 11
    else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}

export default function AdminTable({ reloadData, setReloadData, rows, columns, page, setPage, rowsPerPage, setRowsPerPage, totalPage, details, number, numberOfPage, present, dropStatus }) {
    console.log("printing details =",details);
    const [open, setOpen] = React.useState(false);
    var ls = new SecureLS();
    let storedUserData = {};
    if (ls.get("userData")) {
        storedUserData = JSON.parse(ls.get('userData'));
    }
    const accessToken = storedUserData.accessToken;
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    }
    //console.log(config, "printing config")
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
    const handleActionClick = async (action, id, folio, email, name) => {
        try {
            //console.log("calling Action");
            let data = {
                id: id,
                cml_status: action,
                invEmail: email,
                invName: name,
                adminEmail: JSON.parse(ls.get('userData')).email
            };
            console.log("data from handle click", data)

            if (action == "verified") {
                const encryptData = encrypt(data);
                const finalData = {
                    data: encryptData
                };
                const result = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/admin/update_cml_status`, finalData, config);
                if(result.data) {
                    Swal.fire({
                        text: `Successfully approved Folio ${folio}`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(()=> setReloadData(true))
                } else {
                    Swal.fire({
                        text: "Something went wrong, please try again",
                        icon: "warning",
                        timer: 1500,
                        showConfirmButton: false
                    })
                }
            }

            else if(action == 'rejected'){
                Swal.fire({
                    title: "Reason for Rejection",
                    inputPlaceholder: "Please write reason here",
                    text: "*Please write reason below to inform investor",
                    input: 'text',
                    showCancelButton: true  ,
                    confirmButtonColor: '#1976d2',
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true
                }).then(async(result) => {
                    console.log("Reason: " + result.value);
                    data.reason = result.value
                    const encryptData = encrypt(data);
                    const finalData = {
                        data: encryptData
                    };

                    if(result.value) {
                        await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/admin/update_cml_status`, finalData, config);
                        Swal.fire({
                            text: `Successfully rejected Folio ${folio}`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => setReloadData(true))
                    } else if(result.dismiss) { // do nothing
                    } else {
                        Swal.fire({
                            text: `Please specify reason for rejection`,
                            icon: "error",
                            timer: 1500,
                            showConfirmButton: false
                        })
                    }
                });
            }
            else {
                Swal.fire({
                    text: "something went wrong, please try again",
                    icon: "warning"
                }); 
            }

            const newPage = new Number(page);
            setPage(newPage);

        } catch (error) {
            Swal.fire({
                text: "something went wrong, please try again",
                icon: "error"
            });
        }
    };

const handleDownload = async (id) => {
        try {
            const data = {
                id: id,
                status:dropStatus
            }
            //console.log(id, "printing the id");
            const encryptData = encrypt(data);
            const finalData = {
                data: encryptData
            };
            const result = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/admin/getPreSignedUrl`, finalData, config);
            //console.log(result);
            var decryptedData = JSON.parse(decrypt(result.data.data));
            //console.log(decryptedData);
            //console.log(decryptedData.preSignedUrl);
            if (decryptedData && decryptedData.preSignedUrl) {
                // download_file(decryptedData.preSignedUrl, "fileName");
                var downloadLink = document.createElement("a");
                downloadLink.href = decryptedData.preSignedUrl;
                downloadLink.target = "_blank"; // Open in a new tab
                downloadLink.download = "filename.pdf"; // Specify a filename for the downloaded file
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink)
            }

        } catch (error) {
            //console.log(error);
            Swal.fire({
                text: error.message,
                icon: "error"
            });
        }
    }
    const handleDropDown = (e) => {
        setRowsPerPage(e.target.value);
        setPage(page);
    }


    return (
        <Box sx={{
            bgcolor: "#fff",
            boxShadow: 4,
            marginTop: "20px",
            borderRadius: '8px',
            alignItems: "center",
            height: "auto",
            width: "95%",
            margin: "auto",
            marginBottom: "1rem"
        }}>

            <Paper sx={{ width: window.innerWidth <= 390 ? '87%' : '100%', overflow: "hidden", margin: '.0rem', }}>
                <TableContainer sx={{
                    maxHeight: 300, borderBottom: 'none',
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
                                {columns.map((column) => (
                                    // Only render the 'Action' column if it's not excluded
                                    (column.id !== 'action' || (column.id === 'action' && dropStatus === 'pending')) && (
                                        <StyledTableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, color: column.color, backgroundColor: "#98a0a6", fontSize: "16px", fontWeight: 700 }}
                                        >
                                            {column.label}
                                        </StyledTableCell>
                                    )
                                ))}
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {!present ?
                                (Array.isArray(rows) && rows.map((row, rowkey) => {
                                    return (
                                        <StyledTableRow hover tabIndex={-1} key={rowkey}>
                                            <StyledTableCell align={"center"}>
                                                {row.inv_name}
                                            </StyledTableCell>
                                            <StyledTableCell align={"center"}>
                                                {row.pan}
                                            </StyledTableCell>
                                            <StyledTableCell align={"center"}>
                                                {row.folio}
                                            </StyledTableCell>
                                            <StyledTableCell align={"center"}>
                                                {row.depository.depository}
                                            </StyledTableCell>
                                            <StyledTableCell align={"center"}>
                                                {
                                                    row.depository.depository === "CDSL" ? row.depository.dp_id.substring(0, 8) : row.depository.dp_id
                                                }
                                                {/* {row.depository.dp_id } */}
                                            </StyledTableCell>
                                            <StyledTableCell align={"center"}>
                                                {row.depository.client_id ? row.depository.client_id : row.depository.dp_id.substring(8, 16)}
                                            </StyledTableCell>
                                            {dropStatus === 'pending' && (
                                            <>
                                            <StyledTableCell align={"center"}>
                                               
                                                        <Button
                                                            variant='contained'
                                                            style={{ marginInline: ".5rem", backgroundColor: "#1976d2" }}
                                                            onClick={() => handleActionClick("verified", row.id, row.folio, row.inv_email, row.inv_name)}
                                                        >
                                                            Accept
                                                        </Button>

                                                        <Button
                                                            variant='contained'
                                                            style={{ marginInline: ".5rem", backgroundColor: "#F08080" }}
                                                            onClick={() => handleActionClick("rejected", row.id, row.folio, row.inv_email, row.inv_name)}
                                                        >
                                                            Reject
                                                        </Button>
                                            </StyledTableCell>
                                            </>
                                            )}
                                            <StyledTableCell align={"center"}>
                                                <Button variant='text' style={{ borderRadius: 50 }}>
                                                    <img src={downloadBtn} height={'15px'} width={"15px"} onClick={() => handleDownload(row.id)} />
                                                </Button>
                                            </StyledTableCell>

                                        </StyledTableRow>
                                    );
                                })) : (
                                    <TableRow>
                                        <StyledTableCell colSpan={8} align="center">
                                            <p style={{ textAlign: 'center', fontSize: "16px", margin: '0 auto', maxWidth: "300px" }}>
                                                No Folio Present
                                            </p>
                                        </StyledTableCell>
                                    </TableRow>
                                )}
                        </TableBody>

                    </Table>
                </TableContainer>
                <Box sx={{ display: "flex", paddingBlock: "1rem", justifyContent: "space-between", marginInline: "auto" }}>
                    <Box sx={{ display: "flex", marginInline: "auto" }}>
                        <Box sx={{ display: "flex", marginTop: "12px", minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label">Folio per page</InputLabel>
                            <Select
                                style={{ width: "fit-content", height: "2rem", marginInline: "1rem" }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={rowsPerPage}
                                label="Number of rows"
                                onChange={handleDropDown}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </Box>
                        <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
                            <Pagination
                                count={numberOfPage}
                                page={page + 1}
                                onChange={(event, newPage) => setPage(newPage - 1)}
                                color="primary"
                                variant="outlined"
                                shape="rounded"
                            />
                        </Stack>
                    </Box>

                    <Box>
                        <SelectSmall data={details} dropStatus={dropStatus}/>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}