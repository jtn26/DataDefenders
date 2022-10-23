import './index.css';
import { IconButton, TextField, Button, Alert, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import Header from '../Header'
import { reportSite, getReportCount, getUrl } from '../../shared/api'
import styled from 'styled-components'

const ReportWindow = ({  reportWindowCallback, showPopup }) => {
  console.log('entering reportwindow')
  const [siteCode, setsiteCode] = useState("");
  const [lookupURL, setLookupURL] = useState("")
  const [lookupCount, setLookupCount] = useState(0)
  
  const back = () => {
    reportWindowCallback("hide");
  }

  const handleOnChange = event => {
    setsiteCode(event.target.value);
  };

  const report = async () => {
    if(siteCode.length >= 2 && siteCode.length <= 6) {
      const [res, ok] = await reportSite(siteCode)
      if (ok) {
        showPopup("Your report was submitted!", "success")
        reportWindowCallback("hide");
      } else {
        showPopup(res,"error");
      }
      console.log(res)
    } else if (siteCode.length > 6) {
        showPopup("Code too long!","error");
    } else {
        showPopup("Code too short!","error");
    }
  }
  const getSiteInfo = async () => {
    if(siteCode.length >= 2 && siteCode.length <= 6) {
      const [resURL, okURL] = await getUrl(siteCode)
      if (!okURL) {
        showPopup(resURL,"error");
        return;
      }
      const [resC, okC] = await getReportCount(resURL)
      if (!okC) {
        showPopup(resC,"error");
        return;
      }
      console.log(resURL, resC)
      setLookupURL(resURL)
      setLookupCount(resC)
    } else if (siteCode.length > 6) {
        showPopup("Code too long!","error");
    } else {
        showPopup("Code too short!","error");
    }
  }
  const component = <IconButton sx={{ ml: 2 }} onClick={back} variant="outlined">
  <ArrowBackIos style={{ color: "white" }} />
  <Typography style={{color: "white"}}> Back </Typography>
  </IconButton>

  return (
  
  <div className="reportWindow">
    <Header component={component} />
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 5, mr: 5, mt: 4}}>
      <TextField inputProps={{ style: { color: 'black'}}} InputProps={{ style: { color: 'black'}}} placeholder="XX" onChange={handleOnChange} id="outlined-basic" label="Enter Code" variant="outlined" />
      <Box sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
      <Button sx={{ alignSelf: 'left', mt: 3 }} onClick={getSiteInfo} variant="contained">Lookup</Button>
      <Button sx={{ alignSelf: 'right', mt: 3 }} onClick={report} color="warning" variant="contained">Report</Button>
      </Box>
      {lookupURL && <Typography sx={{ alignSelf: 'left', mt: 3 }} variant="h6">URL: {lookupURL}</Typography>}
      {lookupURL && <Typography sx={{ alignSelf: 'left', mt: 1 }} variant="h6">Reports: {lookupCount}</Typography>}
    </Box>
  </div>
  )
}

export default ReportWindow