import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserAuth from "./Components/UserAuth";
import AuthorityAuth from "./Components/AuthorityAuth";
import HomePage from "./Components/HomePage";
import UserSignup from "./Components/UserSignup";
import AuthoritySignup from "./Components/AuthoritySignup";
import ComplaintPage from "./Components/ComplaintPage";
import UploadPage from "./Components/UploadPage";
import ComplaintSuccess from "./Components/ComplaintSuccess";
import OtpVerify from "./Components/OtpVerify";
import LoginOtpVerify from "./Components/LoginOtpVerify";
import AuthorityForgotPassword from "./Components/AuthorityForgot";
import UserForgotPassword from "./Components/UserForgot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserAuth />} />
        <Route path="/authority" element={<AuthorityAuth />} />
        <Route path="/authority-login" element={<AuthorityAuth />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/authority-signup" element={<AuthoritySignup />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/verify-login-otp" element={<LoginOtpVerify />} />
        <Route path="/user-dashboard" element={<ComplaintPage />} />
        <Route path="/dashboard" element={<ComplaintPage />} />
        <Route path="/complaints" element={<ComplaintPage />} />
        <Route path="/complaints/new" element={<UploadPage />} />
        <Route path="/complaints/success" element={<ComplaintSuccess />} />
        <Route path="/authority/forgot-password" element={<AuthorityForgotPassword />} />
        <Route path="/user/forgot-password" element={<UserForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;