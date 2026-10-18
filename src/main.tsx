import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/chapters.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root is missing from index.html');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
