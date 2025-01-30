import React from 'react';
import { NavLink } from 'react-router-dom';
import "../styles/Sidebar.css";

function Sidebar() {
  
  return (
    <div className='sidebar'>
      <div className='sidebarLogo'>
        <img src="/assets/logo.png" alt="logo" />
      </div>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          <div className="nav-item">
            <img src="/assets/dashboard.png" alt="dashboard" />
            <span>Dashboard</span>
          </div>
        </NavLink>
        <NavLink to="/links" className={({ isActive }) => (isActive ? 'active' : '')}>
          <div className="nav-item">
            <img src="/assets/links.png" alt="links" />
            <span>Links</span>
          </div>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'active' : '')}>
          <div className="nav-item">
            <img src="/assets/analytics.png" alt="analytics" />
            <span>Analytics</span>
          </div>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
          <div className="nav-item">
            <img src="/assets/settings.png" alt="settings" />
            <span>Settings</span>
          </div>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
