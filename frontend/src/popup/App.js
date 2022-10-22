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
  const onClick = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("swag.html") });
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>
          hello
        </p>
        <Button onClick={() => {alert('clicked');}} variant="contained">Generate</Button>
        <Button onClick={onClick} variant="contained">Dashboard</Button>
      </header>
    </div>
  );
}

export default App;
