import '@mantine/core/styles.css';
import './App.css';
import logo from './logo.svg';

import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** TODO Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    </MantineProvider>
  );
}

export default App;
