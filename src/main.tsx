
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Wait for the DOM to be fully loaded before initializing React
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found');
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  
  root.render(
    <App />
  );
});
