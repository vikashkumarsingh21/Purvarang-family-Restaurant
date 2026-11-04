import React from 'react';
import ReactDOM from 'react-dom/client';

// Local self-hosted font imports (no external Google CDN)
import '@fontsource-variable/fraunces/index.css';
import '@fontsource-variable/dm-sans/index.css';
import '@fontsource/tiro-devanagari-hindi/index.css';

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
