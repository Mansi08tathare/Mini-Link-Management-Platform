import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register } from "../services/api";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Mobile validation (only 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If no errors, return true
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await register(formData);
      const resData = await response.json();

      if (response.ok) {
        alert("User created successfully! Now you can log in.");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      } else {
        alert(resData.message || "Error occurred while registering.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <div className="image-section">
        <img src="assets/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="form-section">
        <header className="header">
          <div className="header-buttons">
            <button
              onClick={() => navigate("/signup")}
              className={`header-button ${
                location.pathname === "/signup" ? "active" : "secondary"
              }`}
            >
              SignUp
            </button>
            <button
              onClick={() => navigate("/login")}
              className={`header-button ${
                location.pathname === "/login" ? "active" : "secondary"
              }`}
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
                required
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
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="mobile"
                className="form-input"
                placeholder="Mobile no."
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              {errors.mobile && <p className="error-message">{errors.mobile}</p>}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
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
                required
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
            <button type="submit" className="submit-button">
              Register
            </button>
          </form>
          <div className="form-footer">
            Already have an account?
            <button onClick={() => navigate("/login")} className="link-button">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
