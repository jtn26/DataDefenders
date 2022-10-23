import './index.css';
import { TextField, Button, Box, Alert } from '@mui/material';
import React, { useState } from 'react';
import Header from '../Header';

const EmailWindow = ({ emailAddressCallback, showPopup }) => {
  
  const [userAddress, setUserAddress] = useState("");

  const handleOnChange = event => {
    setUserAddress(event.target.value);
  };
  
  const submit = () => {
    if(userAddress.split("@")[1] == "gmail.com") {
      emailAddressCallback(userAddress);
    }
    else {
      showPopup("Invalid email!","error");
    }
  }

  return <div>
    <Header />
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 5, mr: 5, mt: 2}}>
      <TextField required placeholder="example@gmail.com" onChange={handleOnChange} id="outlined-basic" helperText="Only Gmail is supported" label="Enter Email Address" variant="outlined" />
      <Button onClick={submit} sx={{ alignSelf: 'center', mt: 3 }} variant="contained">Save</Button>
    </Box>
  </div>
}

export default EmailWindow
