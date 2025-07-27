import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // <- Pridėta

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Užregistruojam PWA service worker
serviceWorkerRegistration.register(); // <- Pridėta
