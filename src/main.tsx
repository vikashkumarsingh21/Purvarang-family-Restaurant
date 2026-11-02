import React from 'react';
import ReactDOM from 'react-dom/client';

// Local self-hosted font imports (no external Google CDN)
import '@fontsource-variable/fraunces';
import '@fontsource-variable/dm-sans';
import '@fontsource/tiro-devanagari-hindi';

import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
