
// import React from 'react';

// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import Dashboard from './pages/Dashboard';
// import Link from './pages/Link';
// import Analytics from './pages/Analytics';
// import Setting from './pages/Setting';
// import "./styles/App.css";

// function Layout({ children }) {
//   return (
//     <div className="app">
//       <Sidebar />
//       <div className="main-content">
//         <Navbar />
//         <div className="page-content">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route element={<Layout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/links" element={<Link />} />
//           <Route path="/analytics" element={<Analytics />} />
//           <Route path="/settings" element={<Setting />} />
//           {/* Add more routes here */}
//         </Route>
//       </Routes>
//       <ToastContainer position="bottom-left" />
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Link from './pages/Link';
import Analytics from './pages/Analytics';
import Setting from './pages/Setting';
import "./styles/App.css";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Layout with Nested Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/links" element={<Link />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Setting />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-left" />
    </BrowserRouter>
  );
}

export default App;
