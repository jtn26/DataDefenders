import './index.css';
import { 
   Button, Box, Container, CssBaseline, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ReportWindow from '../../components/ReportWindow'
import { getGibberish } from '../../shared/api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Header from '../Header'

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

const GenerateWindow = ({ emailAddress, showPopup }) => {
  const [reportWindowVar, setReportWindow] = useState("hide")
  const [customEmail, setCustomEmail] = useState("")


  const reportWindowCallback = (show) => {
    setReportWindow(show)
  }

  useEffect(async () => {
    const tab = await getCurrentTab()
    const gibberish = await getGibberish(tab)
    setCustomEmail(emailAddress.split("@")[0] + '+' + gibberish + "@" + emailAddress.split("@")[1])
  }, [setCustomEmail, getCurrentTab, getGibberish])


  const copy = () => {
    console.log('copied')
    navigator.clipboard.writeText(customEmail)
    showPopup("Copied to clipboard.")
  }
  const report = () => {
    reportWindowCallback("show");
  }
  
  const pageContents = 
  (
    <header className="App-header">
      <CssBaseline />
       
       
      < Header />

       
    <Container maxWidth="sm">
      {customEmail ? 
      <Box onClick={copy} sx={{ display: 'flex', flexDirection: 'rows', mt: 8, justifyContent: 'center', alignItems: 'center' }}>
        <Typography>{customEmail}</Typography>
        <IconButton variant="contained"><ContentCopyIcon style={{ color: "black" }} /></IconButton>
      </Box> : 
      <Box>
        <p>Generating gibberish...</p>
      </Box>}
      
      
      <Button onClick={report} sx={{ alignSelf: 'right', mt: 3 }} variant="contained">Lookup/Report Site</Button>
    </Container>
    
    </header>
  )
  return (
    <>
      {reportWindowVar === "hide" && pageContents}
      {reportWindowVar === "show" && <ReportWindow reportWindowCallback={reportWindowCallback} showPopup={showPopup} /> }

    </>
)
}

export default GenerateWindow