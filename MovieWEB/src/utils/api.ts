import axios from "axios";

//const baseURL = "http://localhost:4000";
const baseURL = "https://movieapi.sayerdis.com";

// Config an instance of Axios with the base URL and headers.
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
