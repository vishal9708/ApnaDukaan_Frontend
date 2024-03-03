import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { LoginLayout } from './LoginLayout';
import axios from 'axios';
import '../Assets/images/Background.svg'
import { useNavigate } from "react-router";
import { encrypt, decrypt } from '../Utils/encryption';
import swal from 'sweetalert';
import './login.css'
import SecureLS from 'secure-ls';
const Login = () => {
  const navigate = useNavigate();
  const ls = new SecureLS();
  const [selectedOption, setSelectedOption] = useState('mobile');
  const [identifier, setIdentifier] = useState('');
  const [panNumber, setPanNumber] = useState('');
  // Hardcoded country code for India
  useEffect(() => {
    // const storedUserData = ls.get('userData');
    // if(storedUserData){
    //   //console.log(JSON.parse(storedUserData),"printing the store data ");
    //     navigate("/otp");
    // }else{
    ls.clear();
    if (selectedOption == "mobile")
      setIdentifier('+91');
    else {
      setIdentifier('');
    }
  }, [selectedOption]);

  const isValidMobileNumber = () => {
    // Check if the mobile number follows the format +91{10 digits}
    return /^(\+91\d{10})$/.test(identifier);
  };
  const validate = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panNumber.trim()) {
      swal('Pan Number is required. Please enter a valid Pan Number.');
      return false;
    } else if (selectedOption === 'mobile' && !isValidMobileNumber()) {
      swal('Invalid mobile number. Please enter a valid mobile number.');
      setIdentifier('+91');
      return false;
    } else if (selectedOption === 'email' && !identifier.trim()) {
      swal('Email is required. Please enter a valid email.');
      return false;
    } else if (!panRegex.test(panNumber)) {
      swal('Invalid PAN. Please enter a valid PAN.');
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    // You can perform login logic here

    if (validate()) {
      ////console.log('PanNumber:', panNumber);
      ////console.log('Selected Option:', selectedOption);
      ////console.log('Identifier:', identifier);
      let userData;
      if (selectedOption === "email") {
        userData = {
          email: identifier,
          pan: panNumber,
        }
      }
      else {
        const sanitizedMobile = identifier.replace('+91', '');
        userData = {
          mobile: sanitizedMobile,
          pan: panNumber,
        }
      }
      try {
        ////console.log(userData)
        const encryptData = encrypt(userData);
        const finalData = {
          data: encryptData
        }
        ////console.log(finalData);
        const result = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/auth/login`, finalData);
        ////console.log(result, "Printing result");
        const decryptedData = JSON.parse(decrypt(result.data.data));
        ////console.log(result.data.success);
        // ////console.log(typeof result.data.success);
        if (result.data.success === true) {
          userData.sessionId = decryptedData.sessionId;
          userData.active="user";
          userData.name = decryptedData.name;
          const userDataString = JSON.stringify(userData);
          ls.set('userData', userDataString);
          navigate('/otp');

        }
        if (result.data.success === false) {
          // Handle error when result.data.success is false
          swal("", "Credential Not Found!!!", "error");
        }
      } catch (error) {
        ////console.log(error)
        if (error.response.data.success === false) {
          // Handle error when result.data.success is false
          swal("", "User Not Found", "error");
        } else {
          // Handle other errors
          swal("User Not Found", "error");
        }
      }
    }
  };
  return (
    <LoginLayout LoginText="Login ">
      <Typography style={{ textAlign: 'left' }}>PAN NUMBER</Typography>
      <TextField
        label="ENTER PAN NUMBER"
        type="text"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={panNumber}
        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
      />
      <RadioGroup
        row
        aria-label="login-option"
        name="login-option"
        value={selectedOption}

        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <FormControlLabel className='login-radio' value="mobile" control={<Radio />} sx={{ '& .MuiTypography-root': { fontSize: ".9rem" } }} label="MOBILE NUMBER" />
        <FormControlLabel value="email" control={<Radio />} sx={{ '& .MuiTypography-root': { fontSize: ".9rem" } }} label="EMAIL" />
      </RadioGroup>

      {selectedOption === 'mobile' ? (
        <>
        <TextField
          label="MOBILE NUMBER"
          type="tel"
          fullWidth
          margin="normal"
          variant="outlined"
          required
          value={identifier}
          onChange={(e) => {
            if(e.target.value.length > 2 && e.target.value.substring(0, 3) === "+91"){
            const inputValue = e.target.value;
            const sanitizedValue = inputValue.replace(/\D/g, '').slice(0, 12);
            const newValue = inputValue.startsWith('+') ? '+' + sanitizedValue : sanitizedValue;
            setIdentifier(newValue);
            }
            
          }}
        />
        </>
      ) : (
        <TextField
          label="EMAIL"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value.toUpperCase().replace(/\s/g, ''))}
        />
      )}
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
    </LoginLayout>
  );
};

export default Login;
