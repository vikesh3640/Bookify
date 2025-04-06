import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../src/css/Navbar.css';
import logo from '../assets/logo.jpeg';

axios.defaults.withCredentials = true;

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Load user from localStorage OR fetch from API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      fetchUser();
    }

    // Listen for profile updates from localStorage
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch user details from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/user/me`, { withCredentials: true });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data)); // Save to localStorage
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await axios.get(`${API_BASE}/api/user/logout`, { withCredentials: true });
    setUser(null);
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Bookify Logo" />
        </Link>
      </div>

      {/* Hamburger Menu for Mobile */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/seller" className="nav-item" onClick={() => setMenuOpen(false)}>Sell Books</Link></li>
        <li><Link to="/helpandcontact" className="nav-item" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
        <li><Link to="/cart" className="nav-item" onClick={() => setMenuOpen(false)}>Cart</Link></li>
      </ul>

      {/* User Profile / Login Button */}
      <div className="user-container">
        {user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img 
                src={
                  user.profileImageURL 
                    ? `${API_BASE}${user.profileImageURL}` 
                    : '/images/default.webp'
                } 
                alt="User Profile" 
                className="user-avatar"
              />
              {user.fullName} <span className="dropdown-arrow">˅</span>
            </button>

            {dropdownOpen && (
              <div className="dropdown">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/orders" className="dropdown-item" target="_blank">Orders</Link>
                <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
