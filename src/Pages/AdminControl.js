import React, { useState, useEffect } from "react";
import { encrypt, decrypt } from "../Utils/encryption";
import "./dashboard.css";
import SearchAppBar from "../Utils/search";
import KfinLogoWhite from "../Assets/images/KfinLogoWhite.png";
import KfinLogoNew from "../Assets/images/KfinLogoNew.png";
import axios from "axios";
import { useNavigate } from 'react-router';
import SelectSmall from "../Utils/Dropdown";
import Dropdown from "../Utils/csvDropdown";
import { AppBar, Button, CardMedia, Checkbox, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Typography, colors } from "@mui/material";
import ScrollingTable from "../Utils/Table";
import { NSDLValidator, CDSLValidator } from "../Utils/validators";
import swal from "sweetalert2";
import SecureLS from "secure-ls";
import { Box } from "@mui/system";
import AdminTable from "../Utils/AdminTable";
import logoutLogo from "../Assets/images/logout.png";
import { ErrorPage } from "./Error";
import FundDropDown from "../Utils/fundDropdown";
// import swal from "sweetalert";
let numberOfPage = 2;
const AdminControl = () => {
    var ls = new SecureLS();
    const navigate = useNavigate();
    const [details, setDetails] = useState("");
    const [loader, setLoader] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalpage, setTotalPage] = useState();
    const [present, setPresent] = useState(false);
    const [dropStatus,setDropStatus] =useState("pending");
    let [fundDrop,setFundDrop]=useState([]);
    let [fundValue, setFundValue]=useState();
    const[configration,setConfguration]=useState();
    const [status, setStatus] = useState();
    const [reloadData, setReloadData] = React.useState(false)
    let config;
    let storedUserData;
    useEffect(()=>{
        console.log("useEffect 1 getting called")
        storedUserData = ls.get('userData');
        if (!storedUserData) {
            navigate("/admin/login")
        }
        else if (!JSON.parse(storedUserData)?.accessToken) {
            navigate("/admin/login")
        } 
        else{
            const start=async()=>{
            try{
                setLoader(true);
                storedUserData = JSON.parse(ls.get('userData'));
                const accessToken = storedUserData.accessToken;
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
                setConfguration(config);
                const getFundData={
                    email: storedUserData.email,
                    appName: "dpcl"
                }
                const encryptgetFundData=encrypt(getFundData);
                const finalgetFundData={
                    data: encryptgetFundData
                }
                let funds=await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/admin/getAllFunds`,finalgetFundData,config);
                console.log(funds ,"from start get function")
                const decryptFunds=JSON.parse(decrypt(funds.data.data));
                console.log(decryptFunds,"printing decrypted Funds");
                let allFunds = decryptFunds.fund;
                console.log(allFunds,"printing decrypt Funds")
                setFundDrop(allFunds)
                setFundValue(allFunds[0]?._id?.fund_code)
                ls.set("fund", allFunds[0]?._id?.fund_code)
                setLoader(false);
           }catch(error){
            if (error.response && error.response.status === 403) {
                swal.fire({
                    icon: 'error',
                    title: 'Session Expired',
                    text: 'Your session has expired. Please log in again.'
                });
                navigate("/admin/login");
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error',
                    text: 'An unexpected error occurred. Please try again later.'
                });
            }
           }
          }
          start();
        }

    },[])
    useEffect(() => {
            const nextPage = async () => {
             try{
                setLoader(true);
                const data = {
                    pageNo: `${page + 1}`,
                    size: `${rowsPerPage}`,
                    fund:  fundValue,
                    status: dropStatus
                }
                console.log("useEffect2 getting called")
                // console.log("data from useEffect =>",data,config,"also printing the headers")
                const encryptData = encrypt(data);
                const finalData = {
                    data: encryptData
                }
                let result;
                console.log(fundDrop,"printing fundDrop")
                let decryptedData;
                if(fundDrop.length>0){
                console.log("printing config");
                result = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/admin/get_paginated_invDetails`, finalData, configration);
                decryptedData = JSON.parse(decrypt(result.data.data));
                }
                //console.log(decryptedData)
                if (decryptedData) {
                    // console.log(decryptedData,"printing the decrypted data");
                    //console.log(decryptedData.count, "printing decryptData count");
                    setTotalPage(decryptedData.count);
                    //console.log(totalpage, "total pages");
                    //console.log(totalpage, rowsPerPage);
                    numberOfPage = Math.ceil(totalpage / rowsPerPage)
                    //console.log(numberOfPage, "printing the number of pages");
                    setDetails(decryptedData.invData);
                    setLoader(false)
                    setPresent(false);
                }
                else {
                    setPresent(true);
                    numberOfPage = 1;
                    setLoader(false);
                }
             }catch(error){
                if (error.response && error.response.status === 403) {
                    swal.fire({
                        icon: 'error',
                        title: 'Session Expired',
                        text: 'Your session has expired. Please log in again.'
                    });
                    navigate("/admin/login");
                } else {
                    swal.fire({
                        icon: 'error',
                        title: 'Internal Server Error',
                        text: 'An unexpected error occurred. Please try again later.'
                    });
                }
             }
            }
            nextPage();
    }, [reloadData, page, rowsPerPage, totalpage,fundValue,dropStatus,fundDrop]);

    const column = [
        {
            id: 'name',
            label: 'Name',
            minWidth: 80,
            align: 'center',
        },
        {
            id: 'pan',
            label: 'Pan',
            minWidth: 80,
            align: 'center',
        },
        {
            id: 'folio',
            label: 'Folio',
            minWidth: 80,
            align: 'center',
        },
        {
            id: 'depository',
            label: 'Depository',
            minWidth: 80,
            align: 'center',
        },
        {
            id: 'dp_id',
            label: 'Dp Id',
            minWidth: 200,
            align: 'center',
        },
        {
            id: 'client_id',
            label: 'Client Id',
            minWidth: 120,
            align: 'center',
        },
        {
            id: 'action',
            label: 'Action',
            minWidth: 220,
            align: 'center',
        },
        {
            id: 'download',
            label: 'Download',
            minWidth: 80,
            align: 'center',
        },
    ]
    const userType = JSON.parse(ls.get('userData')).Status;
    if (userType == "admin") {
        return (
            <div className="mainwrap" style={{ paddingTop: 0, width: "100%", height: "99vh" }} >
                <AppBar elevation={6} position="static" sx={{ bgcolor: 'transparent', height: "4rem" }}>
                    <Box style={{ display: 'flex', justifyContent: "space-between" }}>
                        <CardMedia
                            component="img"
                            src={KfinLogoNew}
                            alt="Logo"
                            sx={{ width: '200px', margin: ".5rem 2rem" }}
                        />
                        <CardMedia sx={{ boxShadow: 6, borderRadius: "100%", cursor: "pointer", marginRight: "1rem" }}
                            onClick={() => {
                                ls.clear();
                                navigate("/admin/login")
                            }}>
                            <img
                                component="img"
                                src={logoutLogo}
                                alt="Logo"
                                style={{ width: '20px', hieght: "20px", padding: "1rem " }}
                            />
                        </CardMedia>
                    </Box>
                </AppBar>

                <div className="main_container" style={{ width: "100%", paddingBlock: "2rem", paddingInline: "0", height: "fit-content" }}>
                    {loader &&
                        <div style={{ height: "100%", width: "100%", position: "fixed", top: 0, left: 0, zIndex: 2000, backgroundColor: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                        </div>
                    }
                    <div className="card_container" style={{ width: "95%", paddingBottom: "30px" }}>
                        {/* <Box className="main_header" sx={{ display: 'flex', alignItems: 'center' ,justifyContent: 'flex-end'}}> */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '0 0 60%' }}>
                                <p className="header_content" style={{ fontWeight: 700, fontSize: '28px' }}>Admin Control</p>
                        </Box>
                            <Box className="Wrapper" sx={{ display: 'flex', justifyContent:"end"}}>
                               
                                <Dropdown setDropStatus={setDropStatus} dropStatus={dropStatus}/>
                                <FundDropDown fundDrop={fundDrop} setFundValue={setFundValue} setFundDrop={setFundDrop} configration={configration} status={status} setStatus={setStatus} fundValue={fundValue}/>
                            </Box>
                        {/* </Box> */}
                        <div className="divider" style={{ width: "100%", marginTop: 0 }}></div>
                        <div style={{ marginTop: "2rem" }}>
                            <AdminTable reloadData={reloadData} setReloadData= {setReloadData} rows={details} columns={column} page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} totalPage={totalpage} details={details} numberOfPage={numberOfPage} present={present} dropStatus={dropStatus} />

                        </div>
                        
                    </div>
                </div>



                <footer style={{ position: "fixed", bottom: 0, width: "100%" }}>
                    <span>Powered By</span> <img src={KfinLogoWhite}></img>
                </footer>
            </div >
        );
    } else {
        return (
            <ErrorPage />
        )
    }
};

export default AdminControl;
