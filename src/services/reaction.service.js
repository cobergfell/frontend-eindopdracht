import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080";


const getAll = (reactionType) => {
    return axios.get(API_URL + `/${reactionType}`, { headers: authHeader() });
};

const get = (reactionType,id) => {
    return axios.get(API_URL + `/${reactionType}/${id}`, { headers: authHeader() });
};

//create reaction is either question related to painting or answer related to answer
const create = (id,formData,partial_url,config) => {
    const url=`${API_URL+partial_url}/${id}`
    console.log('18 url',url)
    return axios.post(url, formData,config);
};

const update = (id, formData,partial_url,config) => {
    const url=API_URL+partial_url +`${id}`
    return axios.post(url, formData,config);
};

const remove = (reactionType,id) => {
    return axios.delete(API_URL +`/${reactionType}/${id}`, { headers: authHeader()});
};

const removeAll = (reactionType) => {
    return axios.delete(API_URL+`/${reactionType}`, { headers: authHeader() });

};

//get answers by question or questions by painting
const getReactionsByItem = (reactionType,id) => {
    return axios.get(API_URL+`${reactionType}/${id}`);
};



const ReactionService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    getReactionsByItem,
};

export default ReactionService;