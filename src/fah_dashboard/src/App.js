import React from 'react';
import './App.css';
import './bootstrap.min.css';
import { BrowserRouter, Switch, Route, } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Switch>
        <Route path="/" component={Home} />
      </Switch>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
