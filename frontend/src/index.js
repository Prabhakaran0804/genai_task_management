// index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import App from './App';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using createRoot
root.render(
  <Router>
    <App />
  </Router>
);
