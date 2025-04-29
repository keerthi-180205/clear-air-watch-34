
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure we have a valid root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

// Create root using React 18's createRoot API
const root = ReactDOM.createRoot(rootElement);

// Render the app within StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
