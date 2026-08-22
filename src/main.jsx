import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TradingProvider } from './context/TradingContext';
import { AgentProvider } from './context/AgentContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TradingProvider>
      <AgentProvider>
        <App />
      </AgentProvider>
    </TradingProvider>
  </React.StrictMode>
);
