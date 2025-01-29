import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './styles/Layout.css';

function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <Outlet /> {/* Render child routes here */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
