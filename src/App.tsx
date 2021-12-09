import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Provider } from 'react-redux';
import store from './store/index';
import MainContent from './components/MainContent';


function App() {
  return (
    <Provider store={store}>
        <Navbar />
        <MainContent />
    </Provider>
  );
}

export default App;
