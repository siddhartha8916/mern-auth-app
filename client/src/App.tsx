import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/home";
import About from "./pages/about";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Profile from "./pages/profile";
import Header from "./components/layout/header";
import { ReactQueryProvider } from "./lib/react-query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Header />
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
        <Toaster position="top-center" />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryProvider>
  );
}

export default App;
