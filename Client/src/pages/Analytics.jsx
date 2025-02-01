import React, { useEffect, useState } from "react";
import "../styles/Analytics.css";
import { fetchAnalyticsData } from "../services/api";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const backendURL = "https://mini-link-management-platform-8fhy.onrender.com/";

 
  useEffect(() => {
    const getData = async () => {
      const result = await fetchAnalyticsData(page, limit);
      setData(result.data);
      setTotal(result.total);
    };
    getData();
  }, [page]);

 const formatDate = (timestamp) => {
    console.log("timestamp", timestamp);
    const [datePart, timePart] = timestamp.split(', ');
    const [day, month, year] = datePart.split('/');
    const [time, modifier] = timePart.split(' ');
    let [hours, minutes, seconds] = time.split(':');

    // Convert to 24-hour format
    if (modifier === 'pm' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === 'am' && hours === '12') {
      hours = '00';
    }

    // Create a valid date string for the Date constructor
    const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours}:${minutes}:${seconds}`;
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date'; // Handle invalid date format

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateFormatted = date.toLocaleDateString('en-IN', options);
    const timeFormatted = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });
     // Manually format the date string to match "Jan 30, 2025"
     const [dayFormatted, monthFormatted, yearFormatted] = dateFormatted.split(' ');
     return `${monthFormatted} ${dayFormatted.replace(',', '')}, ${yearFormatted} ${timeFormatted}`;
   };

  const totalPages = Math.ceil(total / limit);

  const getPaginationItems = () => {
    let items = [];
    if (totalPages <= 6) {
      items = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (page <= 3) {
        items = [1, 2, 3, "...", totalPages - 1, totalPages];
      } else if (page >= totalPages - 2) {
        items = [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        items = [1, "...", page - 1, page, page + 1, "...", totalPages];
      }
    }
    return items;
  };

  return (
    <div className="analytics-container">
      <div className="table-container">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>IP Address</th>
              <th>User Device</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>
             {formatDate(row.timestamp)}
                </td>
                <td>{row.originalLink}</td>
                <td>{`${backendURL}${row.shortLink}`}</td>
                <td>{row.ipAddress}</td>
                <td>{row.userDevice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="pagination-btn prev"
        >
          &#8249;
        </button>

        {getPaginationItems().map((item, index) =>
          item === "..." ? (
            <span key={index} className="pagination-ellipsis">
              {item}
            </span>
          ) : (
            <button
              key={index}
              className={`pagination-btn ${page === item ? "active" : ""}`}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="pagination-btn next"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default Analytics;
