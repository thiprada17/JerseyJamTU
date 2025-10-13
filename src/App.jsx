import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

// import SignIn from "./frontend/SignIn";
// import SignUp from "./frontend/SignUp";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Homepage from './frontend/homepage';
import Commu from './frontend/commu/commu';
import CommuForm from './frontend/commu/commuForm';
import Main from './frontend/main/Main';
import MainNews from './frontend/main/MainNews';
import Display from './frontend/ShirtDisplay';

import Sellerform from './frontend/sellerform';
import MixAndMatch from './frontend/MixAndMatch';
import Closet from './frontend/Closetmm';
import UserProfile from './frontend/user-profile/user-profile';

import SevenDayMatch from './frontend/main/News/sevenDayMatch';
import JerseyWith from './frontend/main/News/jerseyWith';
import PersonalColor from './frontend/main/News/personalcolor';



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
          <Route path='/closet' element = {<Closet />} />
          {/* <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}
          <Route path='/userprofile' element = {<UserProfile />} />
          <Route path='/blog/sevenDayMatch' element = {<SevenDayMatch />} />
          <Route path='/blog/jerseyWith' element = {<JerseyWith />} />
          <Route path='/blog/personalColor' element = {<PersonalColor />} />
          
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
