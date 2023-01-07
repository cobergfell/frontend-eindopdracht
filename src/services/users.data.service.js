import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/";


const getAll = () => {
    return axios.get(API_URL + "users", { headers: authHeader() });
};

const get = (userId) => {
    return axios.get(API_URL + `users/${userId}`, { headers: authHeader() });
};

const update = (username, formData) => {
    let config={
        headers: {'Content-Type': 'multipart/form-data'},
        //Authorization:auth
    }
    return axios.put(API_URL +`users/${username}`, formData,config);
};

/*const remove = (userId) => {
    return axios.delete(API_URL +`users/${userId}`, { headers: authHeader()});
};*/

const remove = (username) => {
    return axios.delete(API_URL +`users/${username}`, { headers: authHeader()});
};

const removeAll = () => {
    return axios.delete(API_URL+"users", { headers: authHeader() });

};

const findByUsername = (username) => {
    return axios.get(API_URL+`users/?username=${username}`);
};

const UsersDataService = {
    getAll,
    get,
    update,
    remove,
    removeAll,
    findByUsername,
};

export default UsersDataService;