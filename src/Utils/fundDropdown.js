import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SecureLS from 'secure-ls';

export default function FundDropDown({ fundDrop, setFundValue, status, setStatus ,fundValue}) {
  const ls = new SecureLS();
  let [fundCode, setFundCode] = useState('');
  // setFundCode(fundCode);
  console.log(fundValue,"''''''PRINTING FUND VALUE''''''''")
  console.log(fundCode,".............PRINTING FUND CODE.........")
  useEffect(() => {
    setFundCode(fundValue);
    // setFundCode(fundValue); // Update fundCode when fundValue changes
  }, [fundValue]);
  useEffect(() => {
    console.log(fundValue,"printing useEffect  is getting called")
    setFundCode(fundValue); // Update fundCode when fundValue changes
  }, [fundCode, fundValue]);
  console.log("Fundsssss: ", fundDrop);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        fontSize: 'small',
        overflowX: 'auto'
      },
    },
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue); // Accessing fund_code
    setStatus(selectedValue);
    setFundCode(selectedValue)
    setFundValue(selectedValue);
    ls.set("fund", selectedValue)
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
      <InputLabel id="demo-select-small-label">Fund</InputLabel>
      {console.log(fundCode,"------------------")}
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        label="Fund"
        MenuProps={MenuProps}
        value={fundCode}
        // defaultValue={fundCode}
        onChange={handleChange}
      >
        {fundDrop.map((item, index) => (
          <MenuItem key={index} value={item._id.fund_code}>
            {item._id.fund_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}