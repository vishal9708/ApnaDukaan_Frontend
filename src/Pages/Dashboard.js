import React, { useState, useEffect } from "react";
import { encrypt, decrypt } from "../Utils/encryption";
import "./dashboard.css";

import KfinLogoWhite from "../Assets/images/logo.png";
import KfinLogoNew from "../Assets/images/logo.png";
import axios from "axios";
import { useNavigate } from 'react-router';
import {AppBar, Button, CardMedia,Checkbox, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import ScrollingTable from "../Utils/Table";
import { NSDLValidator, CDSLValidator } from "../Utils/validators";
import swal from "sweetalert2";
import SecureLS from "secure-ls";
import { Box } from "@mui/system";
import logoutLogo from "../Assets/images/logout.png";
import { ErrorPage } from "./Error";
// import swal from "sweetalert";

// axios.defaults.baseURL = process.env.REACT_APP_DEV_BASE_URL;

const Dashboard = () => {
  var ls = new SecureLS();
  const navigate = useNavigate();
  const [lsData, setLsData] = useState({name: ""})
  const [userData, setUserData] = useState({});
  const [depository, setDepository] = useState('NSDL')
  const [dpId, setDpId] = useState("IN");
  const [dp1Id, setDp1Id] = useState("");
  const [clientId, setClientId] = useState("");
  const [fileUploaded, setFileUploaded] = useState(null);
  const [investorName, setInvestorName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [showSelective, setShowSelective] = useState(true)
  const [dataGridRadio, setDataGridRadio] = useState("Single")
  const [dataGridRows, setDataGridRows] = useState([{ scheme_name: "Either you submitted demat account details to us or you don't have any folio under this mode of holding" }])
  const [checkedRows, setCheckedRows] = useState([])
  const [loader, setLoader] = useState(true)
  const isSubmitDisabled = checkedRows.length == 0
  const [dematDetails, setDematDetails] = useState([]);

  useEffect(() => {
    const storedUserData = ls.get('userData');
    if (!storedUserData) {
      navigate("/")
    }
    else if (!JSON.parse(storedUserData)?.accessToken) {
      navigate("/")
    } else {
      setLsData(JSON.parse(storedUserData))
      const accessToken = JSON.parse(storedUserData).accessToken;
      const payload = { pan: JSON.parse(storedUserData).pan };
      // console.log(JSON.parse(storedUserData))
      const encryptData = encrypt(payload);
      const data = {
        data: encryptData,
      }
      const userType = JSON.parse(storedUserData).Status
      if(userType == "user") {
        fetchDematDetails(accessToken, data);
      }
    }
  }, [])

  useEffect(() => {
    if (dematDetails.length > 0) {
      setDataGridRows(dematDetails.filter((rows, index) =>
        (rows.holding == dataGridRadio)
      ))
      setCheckedRows([])
    }
  }, [dataGridRadio])

  const fetchDematDetails = async (accessToken, payload) => {

    // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkFydW4gU2Fob28iLCJ0aW1lU3RhbXAiOjE3MDM3NDQwNDE3MjYsImlhdCI6MTcwMzc0NDA0MSwiZXhwIjoxNzAzNzQ3NjQxfQ.lt9DWWTLv63qakDPq6FlncPqEvKQcva56fEODTyfM9A"
    // const payload = {
    //   "pan": "FIWPM2374B"
    // }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
    try {
      setLoader(true)
      const res = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/demat/getDematDetails`, payload, config);
      const decryptedData = JSON.parse(decrypt(res.data.data));
      ////console.log(res.data)
      setDematDetails(decryptedData)
      setDataGridRows(decryptedData.filter((rows, index) =>
        (rows.holding == dataGridRadio)
      ))
      setCheckedRows([])
      setLoader(false)
    } catch (err) {
      setLoader(false)
      swal.fire({
        // title: 'Alert Title',
        text: 'Failed to fetch details',
        icon: 'warning'
      })

    }
  }
  const handleCheckboxClick = (index) => {
    const isChecked = checkedRows.includes(index);
    if (isChecked) {
      setCheckedRows(checkedRows.filter((item) => item !== index))
    }
    else {
      setCheckedRows([...checkedRows, index])
    }
  }

  const singleHolderColumn = [
    {
      id: 'scheme_name',
      label: 'Scheme Name',
      minWidth: 80,
      align: 'center',
    },
    {
      id: 'folio',
      label: 'Folio ',
      minWidth: 120,
      align: 'center',
    },
  ]
  const jointHolderColumn = [
    {
      id: 'scheme_name',
      label: 'Scheme Name',
      minWidth: 80,
      align: 'center',
    },
    {
      id: 'folio',
      label: 'Folio ',
      minWidth: 120,
      align: 'center',
    },
    {
      id: 'firstHolderName',
      label: 'First Holder Name ',
      minWidth: 120,
      align: 'center',
    },
    {
      id: 'secondHolderName',
      label: 'Second Holder Name ',
      minWidth: 120,
      align: 'center',
    },
    {
      id: 'thirdHolderName',
      label: 'Third Holder Name ',
      minWidth: 120,
      align: 'center',
    },
  ];
  // ////console.log(checkboxData);

  let token = {};
  const requiredURL = window.location.href;
  // ////console.log("The required URL",requiredURL);
  useEffect(() => {
    token = parseUrl(requiredURL);
    //  ////console.log("The required token",token.token);
  }, [])

  const parseUrl = (urlquery) => {

    // ////console.log('url = ', urlquery)

    const url = new URL(urlquery);

    // parse query string
    const params = new URLSearchParams(url.search);

    // ////console.log('params = ', params)

    const obj = {};

    // iterate over all keys
    for (const key of params.keys()) {
      if (params.getAll(key).length > 1) {
        obj[key] = params.getAll(key);
      } else {
        obj[key] = params.get(key);
      }
    }
    // ////console.log('in ParseUrl', obj)
    return obj;
  };



  // ////console.log("The required setuserdata", userData);

  const callHeader = async () => {

    await axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/api/demat/getDematDetails`, {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    }).then((result) => {
      // ////console.log("the result",result);
      if (result.data.message == 'Success') {
        let user_data = result.data.data;
        ////console.log("the result", user_data);
        setUserData(user_data);
        setInvestorName(user_data.Inv_name);
      }
      if (result.data.message == 'You have already submitted the data') {
        navigate('/greetPage');
      }
    }).catch((error) => {
      ////console.log("The required error", error);
    })
  }

  useEffect(() => {
    // callHeader();
  }, [])

  // ////console.log("The required user data", userData);

  const pdfAcceptor = () => {
    const fileInput = document.getElementById('pdfInput');


    const selectedFile = fileInput.files[0];
    if (selectedFile.type != 'application/pdf') {
      swal.fire({
        // title: 'Alert Title',
        text: 'Please Input Pdf File!!',
        icon: 'warning'
      })
      return
    }

    ls.set('selectedFile', selectedFile);
    let mb_file_size = selectedFile.size / (1024 * 1024);
    ////console.log("The mb file size", mb_file_size);
    setFileSize(mb_file_size);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const pdfContent = event.target.result;
        setFileUploaded(selectedFile)
        // Store the PDF content in ls
        ls.set('pdfContent', pdfContent);
        // Optionally, store other file details if needed
        ls.set('pdfFileName', selectedFile.name);
        ls.set('pdfFileSize', selectedFile.size);
        // int mb_file_size = pdfFileSize/()
        // ////console.log("The selected file name & size",selectedFile.name,selectedFile.size);
      };
      reader.readAsDataURL(selectedFile); // Read file as data URL

    }
  }

  const moveLoginPage = async() => {
    let NSDLData = {
      depository: "NSDL",
      dp_id: dpId,
      client_id: clientId
    }
    let CDSLData = {
      depository: "CDSL",
      dp_id: dp1Id,
    }
    let response;
    if (depository == 'NSDL') {
      response = NSDLValidator(dpId, clientId);
      ////console.log("The required NSDL response", response);
      // CL_ID = dpId.concat(clientId);
      if (response) {
        userData.depository = NSDLData;
      } else {
        swal.fire({
          // title: 'Alert Title',
          text: 'Invalid DP Client ID, Please input in proper format!!',
          icon: 'warning'
        })
        return;
      }
    }

    if (depository == 'CDSL') {
      ////console.log(dp1Id, "printing dp1ID");
      response = CDSLValidator(dp1Id);
      ////console.log("The required response", response);
      // ////console.log("The required NSDL response",response);
      if (response) {
        userData.depository = CDSLData;
      } else {
        swal.fire({
          // title: 'Alert Title',
          text: 'Invalid DP Client ID, Please input in proper format!!',
          icon: 'warning'
        })

        return;
      }
    }
    if (fileSize > 2) {
      swal.fire({
        // title: 'Alert Title',
        text: 'File size exceeding 2MB',
        icon: 'warning'
      })

      return;
    }
    if (fileUploaded == null) {
      swal.fire({
        // title: 'Alert Title',
        text: 'Upload valid document',
        icon: 'info'
      })

      return;
    }
    if (response) {
      try {
        setLoader(true)
        const checkedData = checkedRows.map((index) => dataGridRows[index].id)
        const signedUrls = checkedRows.map((index) => dataGridRows[index].preSignedUrl)

        const storedUserData = JSON.parse(ls.get('userData'));
        const accessToken = storedUserData.accessToken;
        // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkFydW4gU2Fob28iLCJ0aW1lU3RhbXAiOjE3MDM3NDQwNDE3MjYsImlhdCI6MTcwMzc0NDA0MSwiZXhwIjoxNzAzNzQ3NjQxfQ.lt9DWWTLv63qakDPq6FlncPqEvKQcva56fEODTyfM9A"
        ////console.log("The required userData", { ...userData.depository, id: checkedData });
        const payload = { ...userData.depository, id: checkedData }
        const encryptData = encrypt(payload)
        const body = {
          data: encryptData,
        }
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }

        await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/demat/updateDematDetails`, body, config)
        handleFileUpload(signedUrls);
        // ls.set('userData', JSON.stringify(userData));

        // navigate('/greetPage');
      }
      catch (err) {
        swal.fire({
          // title: 'Alert Title',
          text: 'Error Occurred',
          icon: 'error'
        })
      }
    }
  }
  const handleFileUpload = async (signedUrls) => {

    try {
      const ress = signedUrls.map(async (signedUrl) => {
        await axios.put(signedUrl, fileUploaded, {
          headers: {
            'Content-Type': 'application/pdf',
          }
        })
      })
      await Promise.all(ress)
      setLoader(false);
      swal.fire({
        title: 'Upload Success!!!',
        // text: 'Upload Success!!!',
        icon: 'success',
        showCancelButton: true,
        cancelButtonText: 'Upload More',
        confirmButtonText: 'Finish',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'sweetalert-finish-button',
          cancelButton: 'sweetalert-upload-more-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "Finish" button
          finishAllFunction();
        } else if (result.dismiss === swal.DismissReason.cancel) {
          // User clicked "Upload More" button or closed the modal
          uploadMoreFunction();
        }
      });


      const finishAllFunction = () => {

        navigate("/")
      };

      const uploadMoreFunction = () => {
        // Handle the "Upload More" button click functionality
        // setCheckedRows([]);
        // setDpId("");
        // setClientId("");
        // navigate("/dashboard")
        window.location.reload();
      };

    }
    catch (err) {
      ////console.log(err)
    }
  }
  const userType = JSON.parse(ls.get('userData')).Status;
  if(userType == "user"){
    return (
      <div className="mainwrap" style={{ paddingTop: '0px' }}>
        {/* <span className="logo">
          <img src={KfinLogoNew} height="40px" width="auto"></img>
        </span> */}
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
                navigate("/")
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
        <div className="main_container">
          {loader &&
            <div style={{ height: "100%", width: "100%", position: "fixed", top: 0, left: 0, zIndex: 2000, backgroundColor: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
            </div>
          }
          <div className="card_container" style={{ paddingBottom: "30px" }}>
            <div className="header_container">
              <p className="header_content">DP ID Submission Request</p>
            </div>
            <div className="individual_details_container">
              <p className="individual_header">
                Hi {lsData.name}!! you are required to provide your demat account details.
              </p>
              <div className="declaration_list" style={{ width: "90%" }}>
                <ul>
                  <li>I/We, the undersigned am / are Investor in the Fund.</li>
                  <li>I/We understand that pursuant to SEBI Circular SEBI/HO/AFD/PoD1/CIR/2023/96, the Investment Manager
                    is required to dematerialise all the issued units of the Fund, and that further issuances of the Units are required to be made in dematerialised form only.</li>
                  <li>Pursuant to the above, I/we hereby request the Investment Manager to undertake all necessary steps, including instructing the depositories as required, to dematerialise the unit(s)
                    registered in my / our name into my / our Demat account as per the details given above</li>
                  <li>In light of the above, I/we hereby confirm the following details:</li>

                </ul>

              </div>
              <div className="individual_information">
                <p className="individual_header">Document upload guidelines:</p>
                <div className="individual_informatrion_contents" style={{ lineHeight: ".4rem" }}>
                  <p className="individual_informatrion_contents_info">
                    1. File Format : .pdf.
                  </p>
                  <p className="individual_informatrion_contents_info">
                    2. File size : File size should not exceed 2MB.
                  </p>
                  <p className="individual_informatrion_contents_info">
                    3. File should not be password protected.
                  </p>
                </div>
              </div>
              <div className="divider"></div>
            </div>

            <p className="tabular_data_key_header">SELECT MODE OF HOLDING</p>
            <div className="label_containers">

              <FormControl sx={{ "& .css-1h9k3so-MuiFormControl-root": { height: "fit-content" } }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="Single"
                  name="radio-buttons-group"
                  className="radio_group"
                >

                  <div>
                    <FormControlLabel
                      value="Single"
                      control={<Radio onClick={() => { setDataGridRadio("Single") }} />}
                      label="Single"
                    />
                    <FormControlLabel
                      value="Joint"
                      control={<Radio onClick={() => { setDataGridRadio("Joint") }} />}
                      label="Joint"
                    />
                  </div>
                </RadioGroup>
              </FormControl>
            </div>
            {/* {dataGridRows.length > 0 ? */}
              <ScrollingTable rows={dataGridRows} checkedRows={checkedRows} columns={dataGridRadio == "Single" ? singleHolderColumn : jointHolderColumn} handleCheckboxClick={handleCheckboxClick} />
              :
              <Box className="label_containers" sx={{
                height: "100px", boxShadow: 4, backgroundColor: "#fff", boxShadow: 6, width: "80%", display: "flex", justifyContent: "center"
              }}>
                {/* <p>Either you submitted demat account details to us or you don't have any folio under this mode of holding</p> */}
                </Box>
            {/* } */}

            <p className="tabular_data_key_header">SELECT DEPOSITORY</p>
            <div className="label_containers">
              <FormControl sx={{ "& .css-1h9k3so-MuiFormControl-root": { height: "fit-content" } }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="NSDL"
                  name="radio-buttons-group"
                  className="radio_group"
                >
                  <div>
                    <FormControlLabel
                      value="NSDL"
                      control={<Radio onClick={() => { setShowSelective(true); setDepository('NSDL') }} />}
                      label="NSDL"
                    />
                    <FormControlLabel
                      value="CDSL"
                      control={<Radio onClick={() => { setShowSelective(false); setDepository('CDSL') }} />}
                      label="CDSL"
                    />
                  </div>
                </RadioGroup>
                {!showSelective &&
                  <div className="inputFields" id="allInputs" style={{ width: "85%", display: 'flex', alignItems: "center", justifyContent: "space-around" }}>
                    <div className="Inputtwo">
                      <div className="individual-input">
                        <Typography
                          style={{
                            textAlign: "left",
                            position: "relative",
                            marginTop: "50px",
                          }}
                        >
                          Enter DPCL ID
                        </Typography>

                        <TextField
                          type="text"  // Using type="text" instead of type="number" to allow leading zeros
                          name="mobile"
                          placeholder="Enter 16 digit DPCL ID"
                          fullWidth
                          helperText="*Please Enter the DP ID + Client ID above"
                          margin="normal"
                          variant="outlined"
                          inputProps={{ maxLength: 16 }}
                          value={dp1Id}
                          onChange={(event) => {
                            // Allow only digits
                            const sanitizedValue = event.target.value.replace(/\D/g, '');

                            // Limit length to 16 characters
                            const newValue = sanitizedValue.slice(0, 16);

                            setDp1Id(newValue);
                          }}
                        />
                      </div>

                    </div>

                    <div className="individual-input">
                      <Typography
                        style={{
                          textAlign: "left",
                          position: "relative",
                          marginTop: "30px",
                        }}
                      >
                        Upload CML Copy
                      </Typography>
                      <TextField
                        type="file"
                        sx={{
                          width: "300px",
                          position: "relative",
                          marginTop: "10px",
                          "@media (max-width: 980px)": { width: "180px" },
                          "@media (max-width: 730px)": { width: "180px" },
                        }}
                        InputProps={{
                          inputProps: {
                            accept: 'application/pdf', // Specify accepted file types
                          },
                        }}
                        id="pdfInput"
                        onChange={pdfAcceptor}
                      />
                    </div>
                  </div>}
                {showSelective &&
                  <div className="inputFields" id="allInputs" style={{ width: "85%", display: "block" }}>
                    <div className="Inputtwo" style={{}}>
                      <div className="individual-input">
                        <Typography
                          style={{
                            textAlign: "left",
                            position: "relative",
                            marginTop: "30px",
                          }}
                        >
                          Enter DP ID
                        </Typography>

                        <TextField
                          name="mobile"
                          placeholder="Enter DP ID"
                          fullWidth
                          margin="normal"
                          helperText="*Please enter the DP ID above*"
                          variant="outlined"
                          sx={{
                            width: "300px",
                            position: "relative",
                            marginTop: "10px",
                            "@media (max-width: 980px)": { width: "180px" },
                            "@media (max-width: 730px)": { width: "180px" },
                          }}
                          inputProps={{ maxLength: 8 }}
                          value={dpId}
                          onChange={(event) => {
                            // Check if the first two characters are "IN"
                            if (event.target.value.startsWith("IN")) {
                              const inputValue = event.target.value;
                              const prefix = "IN";
                              const numericPart = inputValue.substring(prefix.length);
                              const sanitizedNumericPart = numericPart.replace(/\D/g, '').slice(0, 6);
                              const newValue = prefix + sanitizedNumericPart;
                              setDpId(newValue);
                            }
                          }}
                        />
                      </div>

                      <div id="selective-show" className="individual-input" style={{ display: "block" }}>
                        <Typography
                          style={{
                            textAlign: "left",
                            position: "relative",
                            marginTop: "30px",
                          }}
                        >
                          Enter Client ID
                        </Typography>

                        <TextField
                          name="email"
                          placeholder="Enter Client ID"
                          sx={{
                            width: "300px",
                            position: "relative",
                            marginTop: "10px",
                            "@media (max-width: 980px)": { width: "180px" },
                            "@media (max-width: 730px)": { width: "180px" },
                          }}
                          inputProps={{ maxLength: 8 }}
                          value={clientId}
                          onChange={(event) => {
                            const sanitizedValue = event.target.value.replace(/\D/g, '');
                            // Limit length to 8 characters
                            const newValue = sanitizedValue.slice(0, 8);
                            // Set the clientId state
                            setClientId(newValue);
                          }}
                        />
                      </div>
                    </div>

                    <div className="individual-input">
                      <Typography
                        style={{
                          textAlign: "left",
                          position: "relative",
                          marginTop: "30px",
                        }}
                      >
                        Upload CML Copy
                      </Typography>
                      <TextField
                        type="file"
                        sx={{
                          width: "300px",
                          position: "relative",
                          marginTop: "10px",
                          "@media (max-width: 980px)": { width: "180px" },
                          "@media (max-width: 730px)": { width: "180px" },
                        }}
                        InputProps={{
                          inputProps: {
                            accept: 'application/pdf', // Specify accepted file types
                          },
                        }}
                        id="pdfInput"
                        onChange={pdfAcceptor}
                      />
                    </div>
                  </div>}

                <div className="submit">
                  <Button
                    style={{
                      cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                      position: "relative",
                      marginTop: "30px",
                      height: "45px",
                      width: "400px",
                      color: "white",
                      fontStyle: "Roboto",
                      fontSize: "18px",
                      fontWeight: "500",
                      backgroundColor: isSubmitDisabled ? 'gray' : "#1976d2",
                      border: "none",
                    }}
                    label="Get OTP"
                    onClick={moveLoginPage}
                    disabled={isSubmitDisabled}
                  >
                    Submit
                  </Button>
                </div>
              </FormControl>
            </div>
          </div>

        </div>
        <footer>
          <span>Powered By</span> <img src={KfinLogoWhite}></img>
        </footer>
      </div>
    );
  } else {
    return (
      <ErrorPage/>
    )
  }
};

export default Dashboard;
