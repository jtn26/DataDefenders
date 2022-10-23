import './Popup.css';
import { useLocalStorage } from '../../shared/util';
import EmailWindow from '../../components/EmailWindow'
import GenerateWindow from '../../components/GenerateWindow'
import React, { useState } from 'react'

function App() {
  const [emailAddress, setEmailAddress] = useLocalStorage("emailAddress", "")

  const emailAddressCallback = (email) => {
    console.log('setting email')
    setEmailAddress(email)
    console.log(emailAddress)
  }

  return <div className='App'>
    {!emailAddress && <EmailWindow emailAddressCallback={emailAddressCallback} />}
    {emailAddress && <GenerateWindow emailAddress={emailAddress} />}

  </div>
}

export default App;