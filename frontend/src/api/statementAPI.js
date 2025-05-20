import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("⚠️ No authentication token found! Redirecting to login.");
        alert("⚠️ Authentication error! Please log in again.");
        window.location.href = "/login"; // ✅ Redirect if token is missing
    }
    return req;
});

// ✅ Get all statements for the authenticated user
export const getStatements = async () => {
  try {
    const response = await API.get("/statements");
       console.log("✅ Statements fetched successfully:", response.data);
        return response.data;
   } catch (error) {
    console.error("Error fetching statements:", error.response?.data || error);
    throw error;
  }
};

// ✅ Create a new statement
export const createStatement = async (newStatement) => {
  try {
     const token = localStorage.getItem("token");
        if (!token) {
            console.error("⚠️ No authentication token found!");
            alert("⚠️ Authentication error! Please log in again.");
            window.location.href = "/login";
            return;
        }
    const response = await API.post("/statements", newStatement, {
         headers: {
                Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
                "Content-Type": "application/json" // ✅ Set correct request format
            }
        });
    return response.data;
  } catch (error) {
    console.error("Error creating statement:", error.response?.data || error);
    throw error;
  }
};

// ✅ Update a statement
export const updateStatement = async (id, data) => {
  try {
    const response = await API.put(`/statements/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating statement:", error.response?.data || error);
    throw error;
  }
};

// ✅ Delete a statement
export const deleteStatement = async (id) => {
  try {
    const response = await API.delete(`/statements/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting statement:", error.response?.data || error);
    throw error;
  }
};

