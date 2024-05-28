import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import axios from "axios";
import Register from "./page/Register";
import Admin from "./page/Admin";
import "./App.css";
import { NextUIProvider } from "@nextui-org/react";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

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
