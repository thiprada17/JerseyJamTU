import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import SignIn from "./frontend/SignIn";
import SignUp from "./frontend/SignUp";

=======
// import SignIn from "./frontend/SignIn";
// import SignUp from "./frontend/SignUp";
>>>>>>> b31f245cf7458526b563ca6c15bcf1de942a305b
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Commu from './frontend/commu/commu'
import Homepage from './frontend/Homepage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route path="/commu" element={<Commu />} />

          {/* <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
