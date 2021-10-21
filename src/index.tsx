import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/open-sans';
// import '@fontsource/open-sans/300.css'; // for light font
import '@fontsource/open-sans/400-italic.css';
import '@fontsource/open-sans/700.css';

import 'bootstrap/dist/js/bootstrap.bundle';
// import * as bootstrap from 'bootstrap';

import { LoadingPlaceholder } from 'case-web-ui';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingPlaceholder
      color="white"
      minHeight="100vh"
    />}>
      <App />
    </Suspense>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
