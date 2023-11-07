import "./styles/main.scss";
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Prompt from './components/Prompt';
import Footer from './components/Footer';

function App() {

  return (
    <main className="App">
      <Header />
      <Prompt />
      <Footer />
    </main>
  );
}

export default App;
