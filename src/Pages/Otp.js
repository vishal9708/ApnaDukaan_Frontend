import { LoginLayout, OtpTimer } from "./LoginLayout";
import { Box, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router";
import { Formik } from 'formik';
import { encrypt, decrypt } from "../Utils/encryption";
import SecureLS from "secure-ls";

const intialValues = {
    OTP: '',
};
const Otp = () => {
    const navigate = useNavigate();
    const ls = new SecureLS();
    const [value1, setValue1] = useState({
        OTP: '',
    });
    const [loader, setLoader] = useState(false);
    const [userData, setUserData] = useState({});
    const OnOTPSubmit = async () => {
        try {
            if(userData.active==="admin"){
                let accessToken = userData.sessionID;
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
                const data={
                    otp: value1.OTP
                }
                const res = await axios.post(`https://idmdev-api.kfintech.com/api/verifyLoginOtp`, data,config);
                console.log(res,"printing response");
                const result= res.data;
                console.log(result.data.token,"printing token");
                if(result.authenticated){
                    config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${result.data.token}`
                        }
                    }
                    let lsData = JSON.parse(ls.get('userData'))
                    lsData.accessToken =result.data.token;
                    lsData.Status=userData.active;
                    lsData.email= userData.email;
                    ls.set('userData', JSON.stringify(lsData))
                    navigate("/controlPage")
                }
            }else{
            let data = {
                otp: value1.OTP,
                pan: userData.pan,
                sessionId: userData.sessionId,
                Name: userData.name
            };
            const encryptData = encrypt(data);
            const finalData = {
                data: encryptData
            }
            const res = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/otp/validateOtp`, finalData);
            const decryptedData = JSON.parse(decrypt(res.data.data));
            ////console.log(decryptedData);
            ////console.log(decryptedData, "printing the response");
            if (res.data.success === true) {
                let lsData = JSON.parse(ls.get('userData'))
                lsData.accessToken = decryptedData.accessToken;
                lsData.Status=userData.active;
                const Status=userData.active;
                ls.set('userData', JSON.stringify(lsData))
                // swal("", res.data.message, "success");
                navigate("/dashboard");
            
            }
          }
        } catch (error) {
            ////console.log(error)
            if (error.response.data.success === false) {
                // Handle error when result.data.success is 
                swal("", error.response.data.message, "error");
            }
            else if (error.response.data.data) {
                swal("", "your session has been expired", "error");
                ls.clear();
                navigate("/")
            }
            else {
                // Handle other errors
                swal("something went wrong, please try again.");
                navigate("/")
            }
        }
    };

    useEffect(() => {
        // Retrieve user data from ls


        const storedUserData = ls.get('userData');
        ////console.log(storedUserData)
        if (!JSON.parse(storedUserData)?.accessToken  && JSON.parse(storedUserData)?.Status==="user") {
            navigate("/")
        }
        else if (!JSON.parse(storedUserData)?.accessToken  && JSON.parse(storedUserData)?.Status==="admin") {
            navigate("/admin/login")
        }
        else if(JSON.parse(storedUserData)?.Status==="admin"){
            navigate("/controlPage")
        }
        else if(JSON.parse(storedUserData)?.Status==="user"){
            navigate("/dashboard")
        }
        
        else if (JSON.parse(storedUserData)) {
            setUserData(JSON.parse(storedUserData));
        }

    }, []);
    // Example data

    return (
        <LoginLayout LoginText="Validate with OTP">
            <Formik initialValues={intialValues} onSubmit={OnOTPSubmit}>
                {(formikProps) => (
                    <Box component="form">
                        {userData.email && (
                            <Box>
                                <Typography sx={{ color: '#000000', textAlign: 'center', mb: 1.5 }}>
                                    Enter OTP received on Email Address
                                </Typography>
                                <Box
                                    sx={{
                                        mb: 0,
                                        '.otp-input': {
                                            input: {
                                                width: { xs: '37px !important', md: '45px !important' },
                                                fontSize: { xs: '20px !important', md: '30px !important' },
                                                margin: { xs: '2px !important', md: '4px !important' },
                                            },
                                        },
                                    }}
                                >
                                    <OtpInput
                                        value={value1.OTP}
                                        onChange={(OTP) => {
                                            setValue1(prevState => ({ ...prevState, OTP }));
                                        }}
                                        numInputs={6}
                                        inputType="tel"
                                        containerStyle={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                        }}
                                        inputStyle={{
                                            padding: '7px 10px',
                                            borderRadius: '5px',
                                            fontSize: '18px',
                                            margin: '4px'
                                        }}
                                        focusStyle={{ outline: 'none' }}
                                        className="otp-input"
                                        renderInput={(props) => <input {...props} />}
                                    />
                                </Box>
                            </Box>
                        )}

                        {userData.mobile && (
                            <Box sx={{ mt: 3.5 }}>
                                <Typography sx={{ color: '#000000', textAlign: 'center', mb: 1.5 }}>
                                    Enter OTP received on Mobile
                                </Typography>
                                <Box
                                    sx={{
                                        mb: 0,
                                        '.otp-input': {
                                            input: {
                                                width: { xs: '37px !important', md: '45px !important' },
                                                fontSize: { xs: '20px !important', md: '30px !important' },
                                                margin: { xs: '2px !important', md: '4px !important' },
                                            },
                                        },
                                    }}
                                >
                                    <OtpInput
                                        value={value1.OTP}
                                        onChange={(OTP) => {
                                            setValue1(prevState => ({ ...prevState, OTP }));
                                        }}
                                        numInputs={6}
                                        inputType="tel"
                                        isInputSecure={true}
                                        shouldAutoFocus={true}
                                        containerStyle={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                        }}
                                        inputStyle={{
                                            padding: '7px 10px',
                                            borderRadius: '5px',
                                            fontSize: '18px',
                                            margin: '4px'
                                        }}
                                        focusStyle={{ outline: 'none' }}
                                        className="otp-input"
                                        renderInput={(props) => <input {...props} />}
                                    />
                                </Box>
                            </Box>
                        )}

                        <Button
                            style={{
                                position: 'relative', marginTop: '30px',
                                height: '50px', width: '300px',
                                color: 'white', fontStyle: 'Roboto', fontSize: '18px', fontWeight: '400',
                                backgroundColor: '#1976d2', border: 'none',
                            }}
                            label="Validate OTP"
                            onClick={formikProps.handleSubmit}
                        >
                            Validate OTP
                        </Button>
                    </Box>
                )}
            </Formik>

        </LoginLayout>
    );
}

export default Otp;
