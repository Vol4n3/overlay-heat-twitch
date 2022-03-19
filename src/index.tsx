import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';
import {HeatProvider} from './providers/heat.provider';

ReactDOM.render(
  <React.StrictMode>
    <HeatProvider>
      <App />
    </HeatProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

