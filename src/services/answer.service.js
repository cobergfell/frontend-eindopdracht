import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";


const getAll = () => {
    return axios.get(API_URL + "user/answers", { headers: authHeader() });
};

const get = ({answerId}) => {
    return axios.get(API_URL + `user/answers/${answerId}`, { headers: authHeader() });
};

const create = (id,formData,partial_url,config) => {
    const url=`${API_URL+partial_url}/${id}`
    return axios.post(url, formData,config);
};

const createAnswerRelatedToItem = (id,formData,partial_url,config) => {
    const url=`${API_URL+partial_url}/${id}`
    return axios.post(url, formData,config);
};


const update = (answerId, formData,partial_url,config) => {
    const url=API_URL+partial_url +`${answerId}`
    return axios.post(url, formData,config);
};

/*const update = (id, data) => {
    return axios.post(`api/user/questions-edit-with-files-in-database/${id}`, { headers: authHeader(),data:data });
};*/

const remove = (answerId) => {
    return axios.delete(API_URL +`user/answers/${answerId}`, { headers: authHeader()});
};

const removeAll = () => {
    return axios.delete(API_URL+`user/answers`, { headers: authHeader() });

};

const findByTitle = (title) => {
    return axios.get(API_URL+`user/answers?title=${title}`);
};


const getAnswersByQuestionId = (questionId) => {
    return axios.get(API_URL+`user/answers-by-questionId?questionId=${questionId}`);
};

const AnswerService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    getAnswersByQuestionId,
    createAnswerRelatedToItem
    //findByTitle,
};

export default AnswerService;