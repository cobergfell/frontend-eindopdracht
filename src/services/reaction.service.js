import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";


const getAll = (reactionType) => {
    return axios.get(API_URL + `user/${reactionType}`, { headers: authHeader() });
};

const get = (reactionType,id) => {
    return axios.get(API_URL + `user/${reactionType}/${id}`, { headers: authHeader() });
};

const create = (id,formData,partial_url,config) => {
    const url=`${API_URL+partial_url}/${id}`
    return axios.post(url, formData,config);
};

const createReactionRelatedToItem = (id,formData,partial_url,config) => {
    const url=`${API_URL+partial_url}/${id}`
    return axios.post(url, formData,config);
};

const update = (id, formData,partial_url,config) => {
    const url=API_URL+partial_url +`${id}`
    return axios.post(url, formData,config);
};

const remove = (reactionType,id) => {
    return axios.delete(API_URL +`user/${reactionType}/${id}`, { headers: authHeader()});
};

const removeAll = (reactionType) => {
    return axios.delete(API_URL+`user/${reactionType}`, { headers: authHeader() });

};

const getAnswersByQuestionId = (reactionType,id) => {
    return axios.get(API_URL+`user/answers-by-questionId?questionId=${id}`);
};

const ReactionService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    getAnswersByQuestionId,
    createReactionRelatedToItem,
};

export default ReactionService;