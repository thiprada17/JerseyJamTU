import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense } from "react";

// import SignIn from "./frontend/SignIn";
// import SignUp from "./frontend/SignUp";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Homepage from './frontend/Homepage/homepage';
import Commu from './frontend/main/Features/commu/commu';
import CommuForm from './frontend/main/Features/commu/commuForm';
const Main = lazy(() => import('./frontend/main/Main'));
import MainNews from './frontend/main/MainNews';
import Display from './frontend/DisplayShirt/ShirtDisplay';
import Filter from './frontend/main/Filter';

import Sellerform from './frontend/Homepage/sellerform';
import MixAndMatch from './frontend/main/Features/MixAndMatch/MixAndMatch';
import Closet from './frontend/main/Features/MixAndMatch/Closetmm';
import UserProfile from './frontend/user-profile/user-profile';

import SevenDayMatch from './frontend/main/News/sevenDayMatch';
import JerseyWith from './frontend/main/News/jerseyWith';
import PersonalColor from './frontend/main/News/personalcolor';
import CollarJersey from './frontend/main/News/collarJersey';
import LuckyColor from './frontend/main/News/luckuColor';
import ProtectedRoute from './frontend/component/ProtectedRoute';





function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/main" element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Main />
              </Suspense>
            </ProtectedRoute>
          }
          />
          <Route path="/main/news" element={<MainNews />} />

          <Route path="/commu" element={<Commu />} />
          <Route path="/commu/form" element={<CommuForm />} />
          <Route path="/display" element={<Display />} />
          <Route path="/sellerform" element={<Sellerform />} />
          <Route path="/mixAndmatch" element={<MixAndMatch />} />
          <Route path='/closet' element={<Closet />} />
          {/* <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}
          <Route path='/userprofile' element={<UserProfile />} />
          <Route path='/blog/sevenDayMatch' element={<SevenDayMatch />} />
          <Route path='/blog/jerseyWith' element={<JerseyWith />} />
          <Route path='/blog/personalColor' element={<PersonalColor />} />
          <Route path='/blog/collarJersey' element={<CollarJersey />} />
          <Route path='/blog/luckycolor' element={<LuckyColor />} />

          <Route path='/filter' element={<Filter />} />
        </Routes>
      </HashRouter>

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