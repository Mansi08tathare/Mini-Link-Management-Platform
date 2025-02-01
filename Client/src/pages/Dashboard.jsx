import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { fetchTotalClicks, fetchDateWiseClicks, fetchClickDevices } from "../services/api";

const Dashboard = () => {
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [clickDevices, setClickDevices] = useState({ mobile: 0, desktop: 0, tablet: 0 });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const totalClicksData = await fetchTotalClicks();
        setTotalClicks(totalClicksData.totalClicks);

        const dateWiseClicksData = await fetchDateWiseClicks();
        // Sort dateWiseClicksData by date in descending order
        const sortedDateWiseClicks = dateWiseClicksData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setDateWiseClicks(sortedDateWiseClicks);

        const clickDevicesData = await fetchClickDevices();
        setClickDevices(clickDevicesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Total Clicks <span className="total-clicks">{totalClicks}</span></h2>
      </div>
      <div className="content">
        {/* Total Clicks moved here */}
        <div className="left-section">
          <div className="card">
            <p>Date-wise Clicks</p>
            {dateWiseClicks.map((item, index) => (
              <div key={index} className="bar-container">
                <span className="date">{item.date}</span>
                <div className="bar" style={{ width: `${item.totalClicks * 5}px` }}></div>
                <span className="count">{item.totalClicks}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="right-section">
          <div className="card">
            <p>Click Devices</p>
            {Object.entries(clickDevices).map(([device, count]) => (
              <div key={device} className="bar-container">
                <span className="device">{device.charAt(0).toUpperCase() + device.slice(1)}</span>
                <div className="bar" style={{ width: `${count * 5}px` }}></div>
                <span className="count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};  

export default Dashboard;