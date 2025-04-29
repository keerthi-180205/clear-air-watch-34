
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

// Use the regular ReactDOM.render for better compatibility
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);
