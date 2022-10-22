import './Popup.css';
import { useLocalStorage } from '../../shared/util';
import EmailWindow from '../../components/EmailWindow'
import GenerateWindow from '../../components/GenerateWindow'
import { useState } from 'react'

function App() {
  const [emailAddress, setEmailAddress] = useState("email") // useLocalStorage("emailAddress", "test@gmail.com")
  const [reportWindow, setReportWindow] = useState(false)
  const emailAddressCallback = (email) => setEmailAddress(email)
  const reportWindowCallback = (show) => setReportWindow(show)
  console.log('running')

  if (!emailAddress) {
    return <div className='App'>
      <EmailWindow emailAddressCallback={emailAddressCallback} />
    </div>
  }
  return <div className="App">
    {reportWindow ? <ReportWindow reportWindowCallback={reportWindowCallback} /> : <GenerateWindow emailAddress={emailAddress} reportWindowCallback={reportWindowCallback} />}
  </div>
}

export default App;
////defaultValue={userEmail}