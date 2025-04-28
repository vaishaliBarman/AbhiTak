import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
function App() {
//  console.log("App component rendered");

  return (
    <GoogleOAuthProvider clientId="1064735116259-rv4l5gsgril4fdm2pbrmnbjq2phb0aa4.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
