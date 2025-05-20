import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// ✅ Add authentication token to every request using an interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No authentication token found!");
  }
  return req;
});

// ✅ Auth API (Register & Login)
export const register = async (userData) => API.post('/auth/register', userData);

export const login = async (userData) => {
  try {
    const response = await API.post('/auth/login', userData);

    if (response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token); // ✅ Store token properly
      localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ Store user info
      console.log("✅ Token stored successfully!", response.data.token);
    } else {
      console.error("⚠️ No token received from server.");
    }

    return response.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

// ✅ Goals API
export const fetchGoals = async () => API.get('/goals');
export const createGoal = async (newGoal) => API.post('/goals', newGoal);
export const updateGoal = async (id, updatedGoal) => API.put(`/goals/${id}`, updatedGoal);
export const deleteGoal = async (id) => API.delete(`/goals/${id}`);

// ✅ Statements API (Improved handling)
export const fetchStatements = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

   console.log("✅ Checking token before request:", token); // Debugging
  console.log("✅ Checking user ID before request:", user?.id); // Debugging

  if (!token || !user || !user.id) {
    console.error("⚠️ Authentication failed! Missing token or user ID.");
     alert("⚠️ Authentication error! Please log in again."); // ✅ Notify 
    return;
  }

  try {
    const response = await API.get(`/statements?userId=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Request successful. Data:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching statements:", err.response?.data || err.message);
    throw err;
  }
};

export const createStatement = async (newStatement) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("⚠️ No authentication token found! Request blocked.");
    return;
  }

  try {
    const response = await API.post('/statements', newStatement, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (err) {
    console.error("Error creating statement:", err.response?.data || err.message);
    throw err;
  }
};

export const updateStatement = async (id, updatedStatement) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("⚠️ No authentication token found! Request blocked.");
    return;
  }

  try {
    const response = await API.put(`/statements/${id}`, updatedStatement, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (err) {
    console.error("Error updating statement:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteStatement = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("⚠️ No authentication token found! Request blocked.");
    return;
  }

  try {
    await API.delete(`/statements/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Statement deleted successfully!");
  } catch (err) {
    console.error("Error deleting statement:", err.response?.data || err.message);
    throw err;
  }
};