import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Link.css";
import { getLinks, deleteLink, editLink } from "../services/api";

const backendUrl = "https://mini-link-management-platform-8fhy.onrender.com";

const Link = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({ originalUrl: "", remarks: "", expirationDate: "" });
  const limit = 10;

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getLinks(currentPage, limit);
        setLinks(data.data);
        setTotal(data.total);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, [currentPage]);

  const totalPages = Math.ceil(total / limit);

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(`${backendUrl}/${shortUrl}`);
    toast.success("Short URL copied!", { position: "bottom-left" });
  };

  const handleEdit = (link) => {
    setSelectedLink(link);
    setEditData({
      originalUrl: link.originalUrl,
      remarks: link.remarks,
      expirationDate: link.expirationDate.split("T")[0],
    });
    setShowEditModal(true);
  };

  const handleDelete = (linkId) => {
    setSelectedLink(linkId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLink(selectedLink);
      setLinks(links.filter((link) => link._id !== selectedLink));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await editLink(selectedLink._id, editData);
      setLinks(
        links.map((link) => (link._id === selectedLink._id ? { ...link, ...editData } : link))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Remarks</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link._id}>
              <td>
                {new Date(link.expirationDate).toLocaleString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Kolkata",
                })}
              </td>
              <td>{link.originalUrl}</td>
              <td className="short-url">
                {`${backendUrl}/${link.shortUrl}`}
                <img
                  src="/assets/copyIcon.png"
                  alt="Copy"
                  onClick={() => handleCopy(link.shortUrl)}
                />
              </td>
              <td>{link.remarks}</td>
              <td>{link.clickCount}</td>
              <td
                className={
                  new Date(link.expirationDate) < new Date() ? "inactive" : "active"
                }
              >
                {new Date(link.expirationDate) < new Date() ? "Inactive" : "Active"}
              </td>
              <td>
                <img src="/assets/editIcon.png" alt="Edit" onClick={() => handleEdit(link)} />
                <img src="/assets/binIcon.png" alt="Delete" onClick={() => handleDelete(link._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          &lt;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          &gt;
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal">
          <p>Do you want to delete this link?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={() => setShowDeleteModal(false)}>No</button>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <h3>Edit Link</h3>
          <input
            type="text"
            value={editData.originalUrl}
            onChange={(e) => setEditData({ ...editData, originalUrl: e.target.value })}
          />
          <input
            type="text"
            value={editData.remarks}
            onChange={(e) => setEditData({ ...editData, remarks: e.target.value })}
          />
          <input
            type="date"
            value={editData.expirationDate}
            onChange={(e) => setEditData({ ...editData, expirationDate: e.target.value })}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setShowEditModal(false)}>Cancel</button>
        </div>
      )}

      <ToastContainer position="bottom-left" />
    </div>
  );
};

export default Link;
