import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../src/css/Navbar.css';
import logo from '../assets/logo.jpeg';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      fetchUser();
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/me`, {
        withCredentials: true,
      });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const handleLogout = async () => {
    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/logout`, {
      withCredentials: true,
    });
    setUser(null);
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Bookify Logo" />
        </Link>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/seller" className="nav-item" onClick={() => setMenuOpen(false)}>Sell Books</Link></li>
        <li><Link to="/helpandcontact" className="nav-item" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
        <li><Link to="/cart" className="nav-item" onClick={() => setMenuOpen(false)}>Cart</Link></li>
      </ul>

      <div className="user-container">
        {user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img 
                src={
                  user.profileImageURL
                    ? `${import.meta.env.VITE_API_BASE_URL}${user.profileImageURL}`
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
