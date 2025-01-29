// // import './Dashboard.css';
// import React from "react";

// function Dashboard() {
//   const clickData = {
//     totalClicks: 1234,
//     dateWiseClicks: [
//       { date: '21-01-25', clicks: 1234 },
//       { date: '20-01-25', clicks: 1140 },
//       { date: '19-01-25', clicks: 134 },
//       { date: '18-01-25', clicks: 34 }
//     ],
//     deviceClicks: [
//       { device: 'Mobile', clicks: 134 },
//       { device: 'Desktop', clicks: 40 },
//       { device: 'Tablet', clicks: 3 }
//     ]
//   };

//   return (
//     <div className="dashboard">
//       <div className="total-clicks">
//         <h2>Total Clicks</h2>
//         <div className="clicks-number">{clickData.totalClicks}</div>
//       </div>
      
//       <div className="charts">
//         <div className="date-wise-clicks">
//           <h3>Date-wise Clicks</h3>
//           <div className="chart">
//             {clickData.dateWiseClicks.map(item => (
//               <div className="bar-item" key={item.date}>
//                 <div className="date">{item.date}</div>
//                 <div className="bar" style={{ width: `${(item.clicks/1234)*100}%`, backgroundColor: '#4F46E5' }}></div>
//                 <div className="clicks">{item.clicks}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="device-clicks">
//           <h3>Click Devices</h3>
//           <div className="chart">
//             {clickData.deviceClicks.map(item => (
//               <div className="bar-item" key={item.device}>
//                 <div className="device">{item.device}</div>
//                 <div className="bar" style={{ width: `${(item.clicks/134)*100}%`, backgroundColor: '#4F46E5' }}></div>
//                 <div className="clicks">{item.clicks}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

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
        setDateWiseClicks(dateWiseClicksData);

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
            <h3>Date-wise Clicks</h3>
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
            <h3>Click Devices</h3>
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
