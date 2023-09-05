import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/home";
import About from "./pages/about";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Profile from "./pages/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="*"
          element={<div className="text-center">Page Not Found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
