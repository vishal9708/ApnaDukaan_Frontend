import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Radio, RadioGroup, FormControlLabel, styled } from '@mui/material';
import { LoginLayout } from './LoginLayout';
import axios from 'axios';
import '../Assets/images/Background.svg'
import { useNavigate } from "react-router";
import { encrypt, decrypt } from '../Utils/encryption';
import swal from 'sweetalert';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import bcrypt from 'bcryptjs';
import './login.css'
import SecureLS from 'secure-ls';
import { Link } from 'react-router-dom';
const passChar = "Password must minimum of 8 characters at least one digit and at least one special character ";
const Temp = styled(Typography)`
  margin-top: 10px;
  margin-bottom: 10px;
`;
const Temp1 = styled(Typography)`
  margin-top: 10px;
  margin-bottom: 10px;
`;
const Temp2 = styled(Typography)`
 color : Red;
 font-size: 11px;
`
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const url = process.env.REACT_APP_DEV_IDM_BASE_URL;
const AdminLogin = () => {
    const navigate = useNavigate();
    const ls = new SecureLS();
    const[loder,setLoder]=useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Hardcoded country code for India
    useEffect(()=>{
        ls.clear();
        const storedUserData = ls.get('userData');
        // if(storedUserData && JSON.parse(storedUserData).Status==="admin"){
        //     navigate("/otp");
        // }
    })
    const validate = () => {
        if (!email.trim()) {
            swal('Email is required. Please enter a valid email.');
            return false;
        }
        else if (!passwordRegex.test(password)) {
            swal('Invalid password. Please enter a valid password.');
            setPassword('');
            return false
        }
        return true;
    }
    const handleLogin = async () => {
        // setLoder(true);
        if (validate()) {
            try {
                let userData = { 
                    data:{
                    email: email,
                    password: password,
                    appName: "dpcl"
                    }
                }
                const result = await axios.post(`https://idmdev-api.kfintech.com/api/appLogin`, userData);
                console.log(result, "printing Result");
                const finalData = result.data;
                //console.log(result.data.success,"printing the status")
                if (finalData.authenticated === true) {
                    userData.sessionID = finalData.data.token;
                    userData.active = "admin";
                    userData.name = `${finalData.data.firstName}" "${finalData.data.lastName}`;
                    userData.email = finalData.data.email
                    const userDataString = JSON.stringify(userData);
                    ls.set('userData', userDataString);
                    navigate('/otp');

                }
                else{
                    swal('', 'Incorrect username or password', 'error');
                }
                
            }catch(error){
                console.log(error,"printing the error")
                if(error.response && error.response.data.authenticated === false){
                    swal('', 'Account locked. Please try after 5 minute','error');
                }
                else{
                    swal('','Incorrect username or password','error');
                }
            }
        }

    };
    // You can perform login logic here
    return (
        <LoginLayout LoginText="Login " >
            <Temp>EMAIL:</Temp>
            <TextField
                label='Email'
                placeholder='Enter email'
                type="email"
                fullWidth
                variant="outlined"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
            />
            <Temp1 >PASSWORD:</Temp1>
            <TextField
                label='Password'
                placeholder='Enter password'
                type={showPassword ? "text":"password"}
                fullWidth
                variant="outlined"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    ),
                }}
            />
            {
                password && !passwordRegex.test(password) && (
                    <Temp2 error={!passwordRegex.test(password)}>{passChar}</Temp2>
                )
            }
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleLogin}
                    style={{ marginTop: '20px', backgroundColor: "#1976d2" }}
                >
                    Login
                </Button>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <p>Forgot Password? <a href="https://idmdev.kfintech.com/ForgotPassword" target='_blank' style={{color: "#1565C0", textDecoration: "none"}} onMouseOver={e => e.target.style.color='#1565C0'} onMouseOut={e => e.target.style.color='#1565C0'}> Reset Now</a></p>
            </div>
        </LoginLayout>
    );
};

export default AdminLogin;
