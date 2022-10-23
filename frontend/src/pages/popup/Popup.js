import './Popup.css';
import { useLocalStorage } from '../../shared/util';
import EmailWindow from '../../components/EmailWindow'
import GenerateWindow from '../../components/GenerateWindow'
import React, { useState } from 'react'
import { Snackbar, Alert }from '@mui/material';

function App() {
  const [emailAddress, setEmailAddress] = useLocalStorage("emailAddress", "")
  const [open, setOpen] = useState(false)
  const [severity, setSeverity] = useState("info")
  const showPopup = (text, severity = 'info') => {
    console.log('showpopup')
    setText(text);
    setSeverity(severity);
    setOpen(true);
    
  };
  const [text, setText] = useState("")


  const handleClose = () => {
    setOpen(false);
  };

  const emailAddressCallback = (email) => {
    console.log('setting email')
    setEmailAddress(email)
    console.log(emailAddress)
  }

  return <div className='App'>
    {!emailAddress && <EmailWindow emailAddressCallback={emailAddressCallback} showPopup={showPopup} />}
    {emailAddress && <GenerateWindow emailAddress={emailAddress} showPopup={showPopup} />}
    <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={handleClose}
        key={'snackbar'}
      >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {text}
      </Alert>
      </Snackbar>
  </div>
}

export default App;