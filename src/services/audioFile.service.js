import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/";


const getAll = () => {
    return axios.get(API_URL + "audioFilesInDatabase", { headers: authHeader() });
};

const get = (id) => {
    return axios.get(API_URL + `audioFilesInDatabase/${id}`, { headers: authHeader() });
};

const create = (formData,partial_url,config) => {
    const url=API_URL+partial_url
    return axios.post(url, formData,config);
};


const update = (id, formData,partial_url,config) => {
    const url=API_URL+partial_url +`${id}`
    return axios.post(url, formData,config);
};

/*const update = (id, data) => {
    return axios.post(`api/user/questions-edit-with-files-in-database/${id}`, { headers: authHeader(),data:data });
};*/

const remove = (id) => {
    return axios.delete(API_URL +`audioFilesInDatabase/${id}`, { headers: authHeader()});
};

const removeAll = () => {
    return axios.delete(API_URL+"audioFilesInDatabase", { headers: authHeader() });
};


const FileService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
};

export default FileService;