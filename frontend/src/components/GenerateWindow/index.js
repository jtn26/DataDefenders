import './index.css';
import { TextField, Button, Box, Container, CssBaseline, Fab } from '@mui/material';
import React, { useEffect, useState } from 'react'

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
        reject(e);
    }
  })
}

const GenerateWindow = ({ emailAddress,  reportWindowCallback }) => {
  const [currentPage, setCurrentPage] = useState("")

  useEffect(async () => {
    const tab = await getCurrentTab()
    console.log(tab)
    // setCurrentPage(tab)
  }, [currentPage, setCurrentPage])

  const newTab = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
  }
  const copy = () => {
    navigator.clipboard.writeText(emailAddress)
  }
  const report = () => {
    reportWindowCallback(true);
  }

  // const { register, handleSubmit } = useForm();

  return (
  <div className="App">
  <header className="App-header">

    <CssBaseline />
    <Container maxWidth="sm">
      {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
    
    <Fab onClick={newTab} variant="extended">Dashboard</Fab>

    <p>Defender</p>

    <Button onClick={copy} variant="contained">Generate Address</Button>
    
    <Button onClick={report} variant="contained">Report A Site</Button>
    </Container>

  </header>
</div>
)
}

export default GenerateWindow