import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserAuth from "./Components/UserAuth";
import AuthorityAuth from "./Components/AuthorityAuth";
import HomePage from "./Components/HomePage";
import UserSignup from "./Components/UserSignup";
import AuthoritySignup from "./Components/AuthoritySignup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserAuth />} />
        <Route path="/authority" element={<AuthorityAuth />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/authority-signup" element={<AuthoritySignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;