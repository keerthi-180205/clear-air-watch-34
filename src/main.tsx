
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';

// Use the older ReactDOM.render method which is more stable with various React setups
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
