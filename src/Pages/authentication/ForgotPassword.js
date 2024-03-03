import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Radio, RadioGroup, FormControlLabel, styled } from '@mui/material';
import { LoginLayout } from '../LoginLayout';
import axios from 'axios';
import '../../Assets/images/Background.svg'
import { useNavigate } from "react-router";
import { encrypt, decrypt } from '../../Utils/encryption';
import swal from 'sweetalert';
import bcrypt from 'bcryptjs';
import '../login.css'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SecureLS from 'secure-ls';
import { Link } from 'react-router-dom';
const Temp = styled(Typography)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const AdminLogin = () => {
    const navigate = useNavigate();
    const ls = new SecureLS();
    const[loder,setLoder]=useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const validate = () => {
        if (!email.trim()) {
            swal('Email is required. Please enter a valid email.');
            return false;
        }
        return true;
    }
    const handleSendOtp = async () => {
        if (validate()) {
            try {
                let userData = {
                    email: email
                }
                //console.log(userData);
                const encryptData = encrypt(userData);
                const finalData = {
                    data: encryptData
                }
                const result = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/auth/admin_forgotPassword`, finalData);
                const decryptedData = JSON.parse(decrypt(result.data.data));

                if (result.data.success === true) {
                    userData.sessionId = decryptedData.sessionId;
                    userData.active = "admin";
                    const userDataString = JSON.stringify(userData);
                    ls.set('userData', userDataString);
                    swal("", result.data.message, "success").then(()=>{
                        navigate('/resetPassword');
                    });
                }

            } catch (error) {
                if (error.response.data.success === false) {
                    swal("", error.response.data.message, "error");
                }
                else{
                    swal("", `something went wrong`, "error");
                }
               
            }
        }

    };
    // You can perform forgot password logic here
    return (
        <LoginLayout LoginText="Forgot Password " >
            <TextField
                placeholder='Enter email'
                label="Email"
                helperText='*Enter registered email address to change your password*'
                type="email"
                fullWidth   
                variant="outlined"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toUpperCase().replace(/\s/g, ''))}
            />
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSendOtp}
                    style={{ marginTop: '20px', backgroundColor: "#1976d2" }}
                >
                &nbsp; Send OTP &nbsp; <SendRoundedIcon sx={{ width: '20px' }} />
                </Button>
            </div>
        </LoginLayout>
    );
};

export default AdminLogin;
