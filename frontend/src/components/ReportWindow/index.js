import { IconButton, TextField, Button, Alert } from '@mui/material';
import React, { useState } from 'react';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'

const ReportWindow = ({  reportWindowCallback }) => {
  console.log('entering reportwinodw')
  const [siteCode, setsiteCode] = useState("");
  
  const [errorText, setErrorText] = useState("");

  
  const back = () => {
    reportWindowCallback("hide");
  }

  const handleOnChange = event => {
    setsiteCode(event.target.value);
  };

  const submit = () => {
    console.log(siteCode)
    if(siteCode == "AA") {
        reportWindowCallback("hide");
    }
      else {
        setErrorText("Invalid email!");
      }
  }
  
  return <div>
    <IconButton onClick={back} variant="outlined" color="primary" aria-label="Back">
        <ArrowBackIos />
        Back
    </IconButton>
    <TextField placeholder="XX" onChange={handleOnChange} id="filled-basic" label="Enter 2-Digit Code" variant="filled" />
    {errorText && <Alert severity="error"><p>{errorText}</p></Alert>}
    {siteCode && <Button onClick={submit} variant="contained">Submit</Button>}
  </div>
}

export default ReportWindow