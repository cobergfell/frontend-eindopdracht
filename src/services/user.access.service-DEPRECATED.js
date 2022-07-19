
import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};



/*const getUserBoard = () => {
  return axios.get(API_URL + "user/questions-with-files-in-database", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod/questions-with-files-in-database", { headers: authHeader() });
};*/

const getAdminBoard = () => {
  return axios.get(API_URL + "users", { headers: authHeader() });
};

export default {
  getPublicContent,
  // getUserBoard,
  // getModeratorBoard,
  getAdminBoard,
};
