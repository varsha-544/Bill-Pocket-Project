import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const fetchGoals = () => API.get("/goals");
export const createGoal = (goalData) => API.post("/goals", goalData);
export const updateGoal = (id, goalData) => API.put(`/goals/${id}`, goalData);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);
