import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./components/Routes";
import Banner from "./components/Banner";
import './App.css';
import { renewToken } from "./components/Cookies";

function App() {

  renewToken();
  return (
    <Router >
      <Routes />
      {/* <Banner /> */}
    </Router >
  );
}

export default App;
