import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import React from 'react';
 
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5002/login", form);
      localStorage.setItem("token", data.token); // ✅ Save token in localStorage
      localStorage.setItem("userName", data.user.name); 
      navigate("/home");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post("http://localhost:5002/google-login", {
        tokenId: credentialResponse.credential,
      });
     
      localStorage.setItem("token", data.token); // ✅ Save token in localStorage
      localStorage.setItem("userName", data.user.name); 
      navigate("/home");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  //console.log("Login component rendered");

  return (
    <GoogleOAuthProvider clientId= "1064735116259-rv4l5gsgril4fdm2pbrmnbjq2phb0aa4.apps.googleusercontent.com">
      <div>
        <h2>Login page</h2>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Google Login Failed")} />
      </div>
    </GoogleOAuthProvider>
  );
  
};

export default Login;

