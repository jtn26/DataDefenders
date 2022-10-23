import { TextField, Button } from '@mui/material';
import React, { useState } from 'react';

const EmailWindow = ({ emailAddressCallback }) => {
  
  const [userAddress, setUserAddress] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleOnChange = event => {
    setUserAddress(event.target.value);
  };
  
  const submit = () => {
    if(userAddress.split("@")[1] == "gmail.com") {
      setErrorText("")
      emailAddressCallback(userAddress);
    }
    else {
      setErrorText("Invalid email!");
    }
  }

  return <div>
    <TextField required placeholder="example@gmail.com" onChange={handleOnChange} id="filled-basic" label="Enter Your Email Address" variant="filled" />
    
    <Button onClick={submit} variant="contained">Submit</Button>
    {errorText && <p>{errorText}</p>}

    call emailAddressCallback
  </div>
}

export default EmailWindow
