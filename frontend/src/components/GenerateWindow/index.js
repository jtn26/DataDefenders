import './index.css';
import { TextField, Button, Box, Container, CssBaseline, Fab, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ReportWindow from '../../components/ReportWindow'
import { getGibberish } from '../../shared/api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Menu from '@mui/icons-material/Menu'

function getCurrentTab() {

  return new Promise((resolve, reject) => {
    try {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
          const url = tabs[0].url
          const host = url.split('/')[2]
          resolve(host);
        })
    } catch (e) {
      console.log('hit error')
      reject(e);
    }
  })
}

const GenerateWindow = ({ emailAddress }) => {
  const [reportWindowVar, setReportWindow] = useState("hide")
  const [customEmail, setCustomEmail] = useState("")

  const reportWindowCallback = (show) => {
    console.log({ setReportWindow })
    console.log(reportWindowVar)
    console.log('start callback, show: ', show)
    setReportWindow(show)
    console.log('done callback')
    console.log(reportWindowVar)
  }

  useEffect(async () => {
    const tab = await getCurrentTab()
    const gibberish = await getGibberish(tab)
    setCustomEmail(emailAddress + '+' + gibberish)
  }, [setCustomEmail, getCurrentTab, getGibberish])

  const newTab = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
  }
  const copy = () => {
    navigator.clipboard.writeText(customEmail)
  }
  const report = () => {
    reportWindowCallback("show");
  }
  
  const pageContents = 
  (
    <header className="App-header">
      <CssBaseline />
      <Container maxWidth="sm">
        {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
      
      <IconButton onClick={back} variant="outlined" color="primary" aria-label="Back">
        Dashboard
        <Menu />
      </IconButton>
      {/* <Fab onClick={newTab} variant="extended">Dashboard</Fab> */}

      <p>DataDefender</p>

      {customEmail ? 
      <Box sx={{ display: 'flex', flexDirection: 'rows' }}>
        <p>{customEmail}</p>
        <IconButton onClick={copy} variant="contained"><ContentCopyIcon style={{ color: "white" }} /></IconButton>
      </Box> : 
      <Box>
        <p>Generating gibberish...</p>
      </Box>}
      
      
      <Button onClick={report} variant="contained">Report A Site</Button>
      </Container>
    </header>
  )
  return (
    <>
      {reportWindowVar === "hide" && pageContents}
      {reportWindowVar === "show" && <ReportWindow reportWindowCallback={reportWindowCallback} /> }
    </>
)
}

export default GenerateWindow