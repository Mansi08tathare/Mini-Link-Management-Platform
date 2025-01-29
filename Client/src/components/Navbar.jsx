// import React from 'react';
// import {useState,useEffect} from 'react';
// import "../styles/Navbar.css"

// function Navbar() {
//     const[showModal,setShowModal]=useState(false);
//     const [greeting, setGreeting] = useState('');
//     const [userName, setUserName] = useState('');
//     const [destinationUrl, setDestinationUrl] = useState("");
//     const [remarks, setRemarks] = useState("");
//     const [linkExpirationEnabled, setLinkExpirationEnabled] = useState(false);
//     const [expirationDate, setExpirationDate] = useState(new Date());
//     const [formattedDate, setFormattedDate] = useState('');
  
//     const handleSubmit = () => {
//       // Add your submit logic here
//       console.log({
//         destinationUrl,
//         remarks,
//         linkExpirationEnabled,
//         expirationDate: linkExpirationEnabled ? expirationDate : null,
//       });
//     };
  
  
    
//     useEffect(() => {
//       // Fetch user information from localStorage
//     const storedUserName = localStorage.getItem("user");
//     setUserName(storedUserName);
//       //  console.log(storedUserName,"user")
//         const getGreeting = () => {
//           const hour = new Date().getHours();
//           if (hour >= 5 && hour < 12) return '🌅 Good morning';
//           if (hour >= 12 && hour < 17) return '☀️ Good afternoon';
//           if (hour >= 17 && hour < 21) return '🌅 Good evening';
//           return '🌙 Good night';
//         };
        
//         const formatDate = () => {
//           const date = new Date();
//           const options = { weekday: 'short', month: 'short', day: 'numeric' };
//           return date.toLocaleDateString('en-IN', options);
//         };
//         setGreeting(getGreeting());
//         setFormattedDate(formatDate());
//       }, []);

//       const getInitials = (name) => {
//         if (!name) return '';
//         const words = name.split(' ');
//         if (words.length === 1) {
//           return name.slice(0, 2).toUpperCase();
//         }
//         const initials = words.map(word => word[0]).join('');
//         return initials.slice(0, 2).toUpperCase();
//       };

//   return (
//     <div className="navbar">
//       <div className="greeting-container">
//         <div className="greeting">
//           {greeting}, {userName}
//         </div>
//         <div className="date">
//           {formattedDate}
//         </div>
//       </div>
//         <div className="nav-actions">
//            <button className="create-new" onClick={()=>setShowModal(true)}>
//             + Create new
//            </button>
         
//           <input type="search" placeholder="Search by names" className="search-input" />
       
//            <button className="profile">{getInitials(userName)}</button>
//         </div>

//         {showModal && (
//   <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="modal-container bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
//       {/* Modal Header */}
//       <div className="modal-header flex justify-between items-center border-b pb-2">
//         <h2 className="text-lg font-semibold">New Link</h2>
//         <button
//           onClick={() => setShowModal(false)}
//           className="text-gray-500 hover:text-black"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Modal Body */}
//       <div className="modal-body mt-4 space-y-4">
//         {/* Destination URL */}
//         <div>
//           <label className="block text-sm font-medium mb-1" htmlFor="destinationUrl">
//             Destination Url <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="destinationUrl"
//             type="text"
//             placeholder="https://example.com"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2"
//           />
//         </div>

//         {/* Remarks */}
//         <div>
//           <label className="block text-sm font-medium mb-1" htmlFor="remarks">
//             Remarks <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             id="remarks"
//             placeholder="Add remarks"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
//           ></textarea>
//         </div>

//         {/* Link Expiration */}
//         <div className="flex items-center justify-between">
//           <label className="block text-sm font-medium" htmlFor="linkExpiration">
//             Link Expiration
//           </label>
//           <input
//             id="linkExpiration"
//             type="checkbox"
//             className="h-4 w-4"
//             onChange={(e) => setLinkExpirationEnabled(e.target.checked)}
//           />
//         </div>

//         {/* Expiration Date (Conditional) */}
//         {linkExpirationEnabled && (
//           <div>
//             <label className="block text-sm font-medium mb-1" htmlFor="expirationDate">
//               Expiration Date
//             </label>
//             <input
//               id="expirationDate"
//               type="datetime-local"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2"
//             />
//           </div>
//         )}
//       </div>

//       {/* Modal Footer */}
//       <div className="modal-footer mt-4 flex justify-end space-x-2">
//         <button
//           onClick={() => setShowModal(false)}
//           className="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
//         >
//           Create New
//         </button>
//       </div>
//     </div>
//   </div>
// )}

      
//     </div>
//   )
// }

// export default Navbar


import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { createLink } from "../services/api.js";

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [linkExpirationEnabled, setLinkExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [errors, setErrors] = useState({});
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem("user");
    setUserName(storedUserName || "User");

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "🌅 Good morning";
      if (hour >= 12 && hour < 17) return "☀️ Good afternoon";
      if (hour >= 17 && hour < 21) return "🌅 Good evening";
      return "🌙 Good night";
    };

    const formatDate = () => {
                const date = new Date();
                const options = { weekday: 'short', month: 'short', day: 'numeric' };
                return date.toLocaleDateString('en-IN', options);
              };
              setGreeting(getGreeting());
              setFormattedDate(formatDate());
      
      
    // setGreeting(getGreeting());
  }, []);

        const getInitials = (name) => {
        if (!name) return '';
        const words = name.split(' ');
        if (words.length === 1) {
          return name.slice(0, 2).toUpperCase();
        }
        const initials = words.map(word => word[0]).join('');
        return initials.slice(0, 2).toUpperCase();
      };

  const validateForm = () => {
    let newErrors = {};
    if (!destinationUrl.trim()) newErrors.destinationUrl = "This field is mandatory";
    if (!remarks.trim()) newErrors.remarks = "This field is mandatory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateLink = async () => {
    if (!validateForm()) return;
  
    // Get the userId from localStorage or any other source
    const userId = localStorage.getItem("userId"); // Assuming you store it in localStorage
    console.log(userId)
  
    const newLink = {
      originalUrl: destinationUrl, // You might want to rename it to match the API's expected field
      remarks: remarks,
      expirationDate: linkExpirationEnabled ? expirationDate : null,
      userId: userId,  // Add the userId here
    };
  
    try {
      const response = await createLink(newLink);
      console.log("Created Link:", response);
      setShowModal(false);
      setDestinationUrl("");
      setRemarks("");
      setExpirationDate("");
      setErrors({});
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };
  
  return (
    <div className="navbar">
      <div className="greeting-container">
        <div className="greeting">
          {greeting}, {userName}
        </div>
        <div className="date">
           {formattedDate}
         </div>
      </div>

      <div className="nav-actions">
        <button className="create-new" onClick={() => setShowModal(true)}>
          + Create new
        </button>
        <input type="search" placeholder="Search by Remarks" className="search-input" />
        <button className="profile">{getInitials(userName)}</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>New Link</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label>
                  Destination URL <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={`input-field ${errors.destinationUrl ? "error" : ""}`}
                />
                {errors.destinationUrl && <span className="error-text">{errors.destinationUrl}</span>}
              </div>

              <div className="input-group">
                <label>
                  Comments <span className="required">*</span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add remarks"
                  className={`input-field ${errors.remarks ? "error" : ""}`}
                ></textarea>
                {errors.remarks && <span className="error-text">{errors.remarks}</span>}
              </div>

              <div className="toggle-container">
                <label>Link Expiration</label>
                <input
                  type="checkbox"
                  checked={linkExpirationEnabled}
                  onChange={() => setLinkExpirationEnabled(!linkExpirationEnabled)}
                />
              </div>

              {linkExpirationEnabled && (
                <div className="input-group">
                  <label>Expiration Date</label>
                  <input
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="clear-btn" onClick={() => { setDestinationUrl(""); setRemarks(""); setErrors({}); }}>
                Clear
              </button>
              <button className="submit-btn" onClick={handleCreateLink}>
                Create new
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;

