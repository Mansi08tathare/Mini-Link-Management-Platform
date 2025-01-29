const API_URL = "https://mini-link-management-platform-8fhy.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add token to the header
  };
};

export const register = (data) => {
  return fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const login = async (data) => {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const result = await response.json();
    localStorage.setItem("token", result.token); // Store token after login
    return result;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const getLinks = async (currentPage, limit) => {
  try {
    const response = await fetch(
      `${API_URL}/link/getLinks?limit=${limit}&offset=${(currentPage - 1) * limit}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching links");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching links:", error);
    throw error;
  }
};

export const deleteLink = async (linkId) => {
  try {
    const response = await fetch(`${API_URL}/link/deleteLink/${linkId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error deleting link");
    }
  } catch (error) {
    console.error("Error deleting link:", error);
    throw error;
  }
};

export const editLink = async (linkId, editData) => {
  try {
    const response = await fetch(`${API_URL}/link/editLink/${linkId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(editData),
    });

    if (!response.ok) {
      throw new Error("Error updating link");
    }
  } catch (error) {
    console.error("Error updating link:", error);
    throw error;
  }
};

export const getLinksByRemark = async (remark) => {
  try {
    const response = await fetch(`${API_URL}/links?remark=${remark}`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching links by remark:", error);
    throw error;
  }
};

export const createLink = async (linkData) => {
  try {
    const response = await fetch(`${API_URL}/link/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(linkData),
    });

    if (!response.ok) {
      throw new Error("Error creating link");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating link:", error);
    throw error;
  }
};

export const saveUserDetails = async (userData) => {
  const userId = localStorage.getItem("userId");
  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("Details updated successfully");
      localStorage.setItem("user", userData.name);
    } else {
      alert("Failed to update details");
    }
  } catch (error) {
    console.error("Error updating details:", error);
    alert("Error updating details");
  }
};

export const deleteUserAccount = async () => {
  const userId = localStorage.getItem("userId");
  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      alert("Account deleted successfully");
    } else {
      alert("Failed to delete account");
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Error deleting account");
  }
};

export const fetchAnalyticsData = async (page, limit) => {
  try {
    const response = await fetch(
      `${API_URL}/analytics/getLinks?limit=${limit}&offset=${(page - 1) * limit}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json();
    if (result.status === "success") {
      return { data: result.data, total: result.totalClicks };
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { data: [], total: 0 };
  }
};


export const fetchTotalClicks = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/total-clicks`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching total clicks:", error);
    throw error;
  }
};

export const fetchDateWiseClicks = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/dayWiseClick`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching date-wise clicks:", error);
    throw error;
  }
};

export const fetchClickDevices = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/clicks-by-device`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching click devices:", error);
    throw error;
  }
};
