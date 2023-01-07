import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/users/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};


const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};


// const addAuthority = (username, authority) => {
//   return axios.post(API_URL + `authorities/add/${username}/${authority}`);
// };
//
// const removeAuthority = (username, authority) => {
//   return axios.post(API_URL + `authorities/delete/${username}/${authority}`);
// };

export default {
  register,
  login,
  logout,
  getCurrentUser,
  // addAuthority,
  // removeAuthority,
};
