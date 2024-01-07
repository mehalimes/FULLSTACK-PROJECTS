import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthComponent from './pages/Auth';
import ForgotPasswordComponent from './pages/ForgotPassword';
import HomeComponent from './pages/Home';
import NoPageComponent from './pages/NoPage';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';

function App() {

  const loginSuccess = useSelector((state) => state.app.loginSuccess);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route path="/auth" element={<AuthComponent />} />
        <Route path="/forgotpassword" element={<ForgotPasswordComponent />} />
        <Route path="/home" element={<HomeComponent/>} />
        <Route path="*" element={<NoPageComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
