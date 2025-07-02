import axios from "axios";

// Create Axios instance
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Attach token to every request via interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No token found! Redirecting...");
    alert("⚠️ Authentication error! Please log in again.");
    window.location.href = "/login";
  }
  return req;
});

// ✅ Get all statements
export const getStatements = async () => {
  try {
    const response = await API.get("/statements");
    console.log("✅ Statements fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching statements:", error.response?.data || error);
    throw error;
  }
};

// ✅ Create a new statement
export const createStatement = async (newStatement) => {
  try {
    const response = await API.post("/statements", newStatement); // No need to manually set headers
    return response.data;
  } catch (error) {
    console.error("❌ Error creating statement:", error.response?.data || error);
    throw error;
  }
};

// ✅ Update a statement
export const updateStatement = async (id, data) => {
  try {
    const response = await API.put(`/statements/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating statement:", error.response?.data || error);
    throw error;
  }
};

// ✅ Delete a statement
export const deleteStatement = async (id) => {
  try {
    const response = await API.delete(`/statements/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting statement:", error.response?.data || error);
    throw error;
  }
};
