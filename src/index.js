// 🚨 Fix for __WS_TOKEN__ error
if (typeof window.__WS_TOKEN__ === 'undefined') {
  window.__WS_TOKEN__ = null;
}

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
