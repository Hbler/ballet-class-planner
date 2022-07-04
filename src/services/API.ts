import axios from "axios";

const API = axios.create({
  baseURL: "https://ballet-class-planner.herokuapp.com/",
  timeout: 15000,
});

export default API;
