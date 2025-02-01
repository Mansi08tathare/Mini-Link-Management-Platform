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
 {row.timestamp}
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
