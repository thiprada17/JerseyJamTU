import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignIn from "./frontend/SignIn";
// import SignUp from "./frontend/SignUp";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Commu from './frontend/commu/commu'
import CommuForm from './frontend/commu/commuForm'
import Main from './frontend/main/Main'
import MainNews from './frontend/main/MainNews'
import Display from './frontend/ShirtDisplay';
import Sellerform from './frontend/sellerform';
import Homepage from './frontend/homepage';
import 'react-toastify/dist/ReactToastify.css';
import MixAndMatch from './frontend/MixAndMatch';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/main/news" element={<MainNews />} />

          <Route path="/commu" element={<Commu />} />
          <Route path="/commu/form" element={<CommuForm />} />
          <Route path="/display" element={<Display />} />
          <Route path="/sellerform" element={<Sellerform />} />
          <Route path="/mixAndmatch" element = {<MixAndMatch />} />
          {/* <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}
        </Routes>
      </Router>

      <ToastContainer
  position="top-right"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>

    </>
  )
}

export default App
