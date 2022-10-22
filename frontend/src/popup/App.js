import './App.css';
import { TextField, Button } from '@mui/material';

export const getCurrentTabUId = (callback) => {
  const queryInfo = { active: true, currentWindow: true };

  chrome.tabs &&
    chrome.tabs.query(queryInfo, (tabs) => {
      callback(tabs[0].id);
    });
};

function App() {
  var emailAddress = "test@gmail.com";
  const newTab = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
  }
  const copy = () => {
    navigator.clipboard.writeText(emailAddress.state.textToCopy)
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Defender
        </p>
        <Button onClick={copy} variant="contained">Generate</Button>
        <Button onClick={newTab} variant="outlined">Dashboard</Button>
      </header>
    </div>
  );
}

export default App;
