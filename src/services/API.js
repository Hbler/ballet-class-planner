import axios from "axios";

const API = axios.create({
  baseURL: "ballet-class-planner.herokuapp.com/",
  timeout: 1500,
});

export default API;
