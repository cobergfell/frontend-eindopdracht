import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";


const getAll = () => {
    return axios.get(API_URL + "user/audio-files-database", { headers: authHeader() });
};

const get = (id) => {
    return axios.get(API_URL + `user/audio-files-database/${id}`, { headers: authHeader() });
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
    return axios.delete(API_URL +`user/audio-files-database/${id}`, { headers: authHeader()});
};

const removeAll = () => {
    return axios.delete(API_URL+"user/audio-files-database", { headers: authHeader() });
};

// const findByTitle = (title) => {
//     return axios.get(API_URL+`user/questions-edit-with-files-in-database?title=${title}`);
// };

const FileService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    //findByTitle,
};

export default FileService;