import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import '@coreui/icons/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MainProvider } from './providers/MainProvider'
import MainApolloProvider from './providers/MainApolloProvider'

ReactDOM.render(
  <React.StrictMode>
    <MainApolloProvider>
      <MainProvider>
        <App />
      </MainProvider>
    </MainApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
