import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@aws-amplify/ui-react/styles.css';
import { Route, RouterProvider, createHashRouter } from 'react-router-dom';
import Signin from './Signin';
import Listings from './Listings'

import { Amplify, Analytics } from 'aws-amplify';
import awsExports from './aws-exports';
Amplify.configure(awsExports);
Analytics.autoTrack('pageView', {
  enable: true,
  type: 'SPA'
})

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'listings',
        element: <Listings />,
      },
      {
        path: 'signin',
        element: <Signin />,
      },


    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
