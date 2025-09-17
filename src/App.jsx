import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignIn from "./frontend/SignIn";
// import SignUp from "./frontend/SignUp";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Commu from './frontend/commu/commu'
import CommuForm from './frontend/commu/commuForm'
<<<<<<< Updated upstream
import Main from './frontend/main/Main'
import MainNews from './frontend/main/MainNews'
import Homepage from './frontend/homepage';
=======
// import Homepage from './frontend/Homepage';
>>>>>>> Stashed changes
import Display from './frontend/ShirtDisplay';

function App() {

  return (
    <>
      <Router>
        <Routes>
<<<<<<< Updated upstream
          <Route path="/" element={<Homepage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/main/news" element={<MainNews />} />
=======
          {/* <Route path="/" element={<Homepage />} /> */}
          {/* <Route path="/" element={<Commu />} /> */}
>>>>>>> Stashed changes

          <Route path="/commu" element={<Commu />} />
          <Route path="/commu/form" element={<CommuForm />} />
          <Route path="/display" element={<Display />} />
          {/* <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
