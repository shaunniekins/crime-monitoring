import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import axios from "axios";
import Register from "./page/Register";
import Admin from "./page/Admin";
import "./App.css";
import { NextUIProvider } from "@nextui-org/react";
import { serverUrl } from "./urlConfig";

axios.defaults.baseURL = serverUrl;

const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
script.async = true;
document.body.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <NextUIProvider>
      <Router>
        <Routes>
          <Route path="/signIn" element={<Login />} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </NextUIProvider>
  </React.StrictMode>
);

reportWebVitals();
