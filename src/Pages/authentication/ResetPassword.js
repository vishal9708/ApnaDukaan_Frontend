import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Radio, RadioGroup, FormControlLabel, styled } from '@mui/material';
import { LoginLayout } from '../LoginLayout';
import axios from 'axios';
import '../../Assets/images/Background.svg'
import { useNavigate } from "react-router";
import { encrypt, decrypt } from '../../Utils/encryption';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import swal from 'sweetalert';
import bcrypt from 'bcryptjs';
import '../login.css'
import SecureLS from 'secure-ls';
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
const ResetPassword = () => {
    const navigate = useNavigate();
    const ls = new SecureLS();
    const[loder,setLoder]=useState(false);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // Hardcoded country code for India
    useEffect(()=>{
        const storedUserData = ls.get('userData');
        if(storedUserData && JSON.parse(storedUserData).Status==="admin"){
            navigate("/otp");
        }
    })
    const onSubmitHandler = async () => {
        // setLoder(true);
        const fixedSalt = "$2a$10$1234567890123456789012"
        const hashedPassword = bcrypt.hashSync(password, fixedSalt);
        const storedUserData = JSON.parse(ls.get("userData"))
        try {
            let userData = {
                otp: otp,
                sessionId: storedUserData.sessionId, //taking from local storage
                email: storedUserData.email, 
                password: hashedPassword,
            }
            //console.log(userData);
            const encryptData = encrypt(userData);
            const finalData = {
                data: encryptData
            }
            //console.log(finalData,"printing the ");
            const result = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/auth/admin_resetPassword`, finalData);
            //console.log(result, "printing Result");
            const decryptedData = JSON.parse(decrypt(result.data.data));
            //console.log(result.data.success,"printing the status");

            if (result.data.success === true) {
                swal("", "Password changed successfully", "success").then(()=>{
                    ls.clear();
                    navigate('/admin/login');
                });
            }

        } catch (error) {
            console.log(error,"printing the error ")
            if (error.response.data.success === false) {
                // Handle error when result.data.success is false
                // //console.log(result.data,"present data");
                swal("", error.response.data.message, "error");
            }
            else{
                swal("", `Something went wrong`, "error");
            }
            
        }
    };
    // You can perform login logic here
    return (
        <LoginLayout LoginText="Reset Password" >
            <Temp>OTP:</Temp>
            <TextField
                type="text"
                placeholder='Enter OTP'
                fullWidth
                variant="outlined"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
            />
            <Temp1 >New Password</Temp1>
            <TextField
                type={showPassword ? "text":"password"}
                placeholder='Enter new password'
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
                    onClick={onSubmitHandler}
                    style={{ marginTop: '20px', backgroundColor: "#1976d2" }}
                >
                    Submit
                </Button>
            </div>
        </LoginLayout>
    );
};

export default ResetPassword;
