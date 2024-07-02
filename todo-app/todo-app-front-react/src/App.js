import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import React from "react";
import Verify from "./pages/Verify";
import ForgotPasswordLinkSender from "./pages/ForgotPasswordLinkSender";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/verify" element={<Verify />} /> 
        <Route
          path="/forgot-password-link-sender"
          element={<ForgotPasswordLinkSender />}
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
