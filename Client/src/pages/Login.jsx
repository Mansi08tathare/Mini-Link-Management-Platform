import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/LandingPage.css"
import {login} from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // formData('')
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Login data:', formData);
  //   setFormData("")
  // };
  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData); 
      // console.log("res",res)
      if (res.token) {
        localStorage.setItem("token", res.token); 
        localStorage.setItem("user", res.user); 
        localStorage.setItem("userId",res.userId)
       
        // setUser(res.user);
        alert("Login Successful");
        navigate("/dashboard");
      } else {
        setError("Invalid login credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <div className="image-section" >
      <img src="assets/logo.png" alt="Logo" className='logo'></img>
        </div>
      <div className="form-section">
        <header className="header">
          {/* <a href="/" className="logo">C·vette</a> */}
      
          <div className="header-buttons">
            <button 
              onClick={() => navigate('/signup')} 
              className={`header-button ${location.pathname === '/signup' ? 'active' : 'secondary'}`}
            >
              SignUp
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className={`header-button ${location.pathname === '/login' ? 'active' : 'secondary'}`}
            >
              Login
            </button>
          </div>
        </header>
        
        <div className="form-container">
          <h1 className="form-title">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Email id"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
            {error && <p>{error}</p>}
          </form>
          <div className="form-footer">
            Don't have an account?
            <button onClick={() => navigate('/signup')} className="link-button">SignUp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;