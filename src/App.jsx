import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserAuth from "./Components/UserAuth";
import AuthorityAuth from "./Components/AuthorityAuth";
import HomePage from "./Components/HomePage";
import UserSignup from "./Components/UserSignup";
import AuthoritySignup from "./Components/AuthoritySignup";
import ComplaintPage from "./Components/ComplaintPage";
import UploadPage from "./Components/UploadPage";
import ComplaintSuccess from "./Components/ComplaintSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserAuth />} />
        <Route path="/authority" element={<AuthorityAuth />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/authority-signup" element={<AuthoritySignup />} />
        <Route path="/complaints" element={<ComplaintPage />} />
        <Route path="/complaints/new" element={<UploadPage />} />
        <Route path="/complaints/success" element={<ComplaintSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;