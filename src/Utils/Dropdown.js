import React, { useState } from 'react';
import { decrypt, encrypt } from './encryption';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CSVLink } from 'react-csv';
import downloadBtn from "../Assets/images/download-button.png"
import axios from 'axios';
import SecureLS from "secure-ls";
import { Button } from '@mui/material';

export default function SelectSmall({ data, dropStatus }) {
  const [status, setStatus] = useState('');
  var ls = new SecureLS();
  const onclickHandler = async (event) => {    
      console.log("called export ALL")
      const storedUserData = JSON.parse(ls.get('userData'));
      const accessToken = storedUserData.accessToken;
      //console.log(">>>>>>>>>>>>>>>", accessToken)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
      console.log("fund code from export all",ls.get("fund"))
      const data = {
        status: dropStatus,
        fund:ls.get("fund")
      };
      const encryptData = encrypt(data);
      const finalData = {
        data: encryptData
      }
      const result = await axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/api/admin/exportAll`,finalData, config);
      console.log(result, "printing result");
      const decryptedData = JSON.parse(decrypt(result.data.data));
      console.log(decryptedData);
      const s3Url = decryptedData;

      // Create a temporary anchor element
      const downloadLink = document.createElement('a');

      // Set its href to the S3 URL
      downloadLink.href = s3Url;

      // Set the download attribute and a suggested filename
      downloadLink.download = 'downloaded_file.csv';

      // Append the anchor element to the body
      document.body.appendChild(downloadLink);

      // Trigger a click on the anchor to initiate the download
      downloadLink.click();
  };

  return (
    // <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Button id="demo-select-small-label" sx={{ color: '#0000FF', background: '#FFF380', borderRadius: '10px'}} onClick={()=> onclickHandler()}> Export All &nbsp;  <img src={downloadBtn} height={'15px'} width={"15px"}/> </Button>
        /* <CSVLink
          data={data}
          filename="data.csv"
          headers={[
            { label: 'Name', key: 'inv_name' },
            { label: 'PAN', key: 'pan' },
            { label: 'Folio', key: 'folio' },
            { label: 'Depository', key: 'depository.depository' },
            { label: 'DP ID', key: 'depository.dp_id' },
            { label: 'Client ID', key: 'depository.client_id' },
            { label: 'Fund Name', key: 'fund_name' },
            { label: 'Scheme Name', key: 'scheme_name' },
            { label: 'Email', key: 'inv_email' }
          ]}
          disabled={status !== 'given'}
        >
        </CSVLink> */
      // </Select>
    // </FormControl>
  );
}
