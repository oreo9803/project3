import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    // 우리가 만든 서버로 보내는 GET 요청
      axios.get("/api/hello")
          .then((response) => {
            setMessage(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ul>
            {message.map((text, index) => <li key={`${index}-${text}`}>{text}</li>)}
        </ul>
      </header>
    </div>
  );
}

export default App;
