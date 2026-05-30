import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-attendance-backend-st3f.onrender.com/api",
});

export default API;