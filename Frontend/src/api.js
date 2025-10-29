import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change to your backend URL on deploy
});

export const getPortfolio = () => API.get("/portfolio");
