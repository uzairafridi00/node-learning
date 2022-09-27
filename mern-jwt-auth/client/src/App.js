import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Login from "./pages/Login"
import Secret from "./pages/Secret"
import Register from "./pages/Register"



function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/Login" element={<Login />}></Route>
        <Route exact path="/" element={<Secret />}></Route>
        <Route exact path="*" element={<h1>Not Found Any Page</h1>}></Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
