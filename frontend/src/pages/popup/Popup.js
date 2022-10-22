import './Popup.css';
import { useLocalStorage } from '../../shared/util';
import EmailWindow from '../../components/EmailWindow'
import GenerateWindow from '../../components/GenerateWindow'

export const getCurrentTabUId = (callback) => {
  const queryInfo = { active: true, currentWindow: true };

  chrome.tabs &&
    chrome.tabs.query(queryInfo, (tabs) => {
      callback(tabs[0].id);
    });
};

function App() {
  const [emailAddress, setEmailAddress] = useLocalStorage("emailAddress", "test@gmail.com")
  const emailAddressCallback = (email) => setEmailAddress(email)

  return <div className="App">
    {emailAddress ? <GenerateWindow emailAddress={emailAddress} /> : 
    <EmailWindow emailAddressCallback={emailAddressCallback} />}
  </div>
}

export default App;
