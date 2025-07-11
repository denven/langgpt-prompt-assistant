import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          AI News Hub
        </NavLink>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" className="nav-links" end>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className="nav-links">
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;