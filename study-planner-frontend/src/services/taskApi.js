import axios from "axios";

const API = axios.create({
  baseURL: "https://study-planner-api-ichs.onrender.com/api/tasks",
});

export default API;
