import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5002/signup", form);
      navigate("/");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  //console.log("Signup component rendered");

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Signup</button> 
      </form>
    </div>
  );
};

export default Signup;