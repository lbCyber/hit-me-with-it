import "./styles/main.scss";
import { useEffect, useState } from 'react';
import Prompt from './components/Prompt';
import Loading from './components/Loading';

function App() {

  const [loading, setLoading] = useState(false);

  return (
    <main className="App">
      {loading ? <Loading /> : null}
      <Prompt setLoading={setLoading} />
    </main>
  );
}

export default App;
