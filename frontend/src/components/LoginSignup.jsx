import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Login.module.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Add this to make sure Axios sends credentials (cookies)
  axios.defaults.withCredentials = true;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${API_BASE}/api/user/signin`, formData);
        
        if (response.data.user) {
          // No need to store user in localStorage anymore
          // The token will be automatically stored in cookies by the backend
        }

        navigate('/');
      } else {
        response = await axios.post(`${API_BASE}/api/user/signup`, formData);
        alert("Signup Successful!");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className={styles.loginSignupContainer}>
      <div className={styles.formContainer}>
        {/* Left Section */}
        <div className={styles.left}>
          <h1>All Books solutions at one place.</h1>
          <p>Get any book to every book at the minimum cost. </p>
        </div>

        {/* Right Section (Login/Signup Form) */}
        <div className={styles.right}>
          <div className={styles.logoContainer}>
            <img src="/logo.jpeg" alt="Logo" className={styles.logo} />
            <h2>Bookify</h2>
          </div>
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>Please {isLogin ? "login" : "signup"} to your account</p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitBtn}>
              {isLogin ? "Login" : "Signup"}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <p className={styles.toggleText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {" "}
              {isLogin ? "Signup" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
