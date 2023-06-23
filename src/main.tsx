import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { CacheContextProvider } from './context/CacheContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CacheContextProvider>
      <App />
    </CacheContextProvider>
  </React.StrictMode>
);
