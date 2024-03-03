import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Dropdown({setDropStatus, dropStatus}) {
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    setStatus(event.target.value);
    setDropStatus(event.target.value)
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Status</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={dropStatus}
        label="Status"
        onChange={handleChange}
      >
        <MenuItem value="verified">Approved</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
      </Select>
    </FormControl>
  );
}
