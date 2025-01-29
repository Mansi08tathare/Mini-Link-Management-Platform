import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {register} from '../services/api';
// import {logo} from '../assets/logo.png';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Signup data:', formData);
  //   // setFormData("")
  // };

  // //need to test
  // if (formData.password !== formData.confirmPassword) {
  //   setError('Passwords do not match');
  //   return;
  // }

  const handleRegister = async(e)=>{
    e.preventDefault();
    const res = await register(formData)
    if(res.status===200){
     alert("register successfully")
    }else{
      console.log(res,"res")
      alert('error')
    }
  }

  return (
    <div className="app-container">
      <div className="image-section">
      <img src="assets/logo.png" alt="Logo" className='logo'></img>
      </div>
      <div className="form-section">
        <header className="header">
     
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
          <h1 className="form-title">Join us Today!</h1>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
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
                type="tel"
                name="mobile"
                className="form-input"
                placeholder="Mobile no."
                value={formData.mobile}
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
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-button">
              Register
            </button>
          </form>
          <div className="form-footer">
            Already have an account?
            <button onClick={() => navigate('/login')} className="link-button">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;