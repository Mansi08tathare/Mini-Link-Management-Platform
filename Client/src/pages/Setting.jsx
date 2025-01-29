
import React, { useState } from "react";
import "../styles/Setting.css";
import { saveUserDetails, deleteUserAccount } from "../services/api.js"; 

function Setting() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await saveUserDetails(userData); // Use the imported saveUserDetails function
  };

  const handleDelete = async () => {
    await deleteUserAccount(); // Use the imported deleteUserAccount function
  };

  return (
    <div className="settings-container">
     

      <div className="input-container">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="input-container">
        <label htmlFor="email">Email id</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="input-container">
        <label htmlFor="mobile">Mobile no.</label>
        <input
          type="text"
          name="mobile"
          value={userData.mobile}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <button onClick={handleSave} className="save-button">Save Changes</button>
      <button onClick={handleDelete} className="delete-button">Delete Account</button>
    </div>
  );
}

export default Setting;
