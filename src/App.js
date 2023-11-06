import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Prompt from './components/Prompt';
import Loading from './components/Loading';


function App() {

  const [loading, setLoading] = useState(false);

  return (
    <main className="App">
      {loading ? <Loading /> : null}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Prompt setIsLoading={setLoading} />
    </main>
  );
}

export default App;
