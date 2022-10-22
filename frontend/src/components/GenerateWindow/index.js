import './index.css';
import { TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react'

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

const GenerateWindow = ({emailAddress }) => {
  const [currentPage, setCurrentPage] = useState(null)
  const [showReportSection, setShowReportSection] = useState(false);

  useEffect(async () => {
    const tab = await getCurrentTab()
    console.log(tab)
    setCurrentPage(tab)
  }, [currentPage, setCurrentPage])

  const newTab = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
  }
  const copy = () => {
    navigator.clipboard.writeText(emailAddress)
  }
  const submit = () => {
    setShowReportSection(true);
  }

  return (
  <div className="App">
  <header className="App-header">
    <p>
      Defender
    </p>
    <Button onClick={copy} variant="contained">Generate</Button>
    
    <Button onClick={submit} variant="contained">Report A Site</Button>
    {showReportSection && <div>
      <TextField  id="outlined-basic" label="Enter Bad Email Address" variant="outlined" />
      </div>}
    
    <Button onClick={newTab} variant="outlined">Dashboard</Button>
  </header>
</div>
)
}

export default GenerateWindow