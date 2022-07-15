import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";


const getAll = () => {
    return axios.get(API_URL + "user/questions", { headers: authHeader() });
};

const get = (questionId) => {
    return axios.get(API_URL + `user/questions/${questionId}`, { headers: authHeader() });
};

const create = (formData,partial_url,config) => {
    const url=API_URL+partial_url
    return axios.post(url, formData,config);
};



const createOrUpdateQuestion = (formData,partial_url,config) => {
    const url=`${API_URL+partial_url}`
    return axios.post(url, formData,config);
};



// const update = (questionId, formData,partial_url,config) => {
//     const url=API_URL+partial_url +`${questionId}`
//     return axios.post(url, formData,config);
// };

/*const update = (id, data) => {
    return axios.post(`api/user/questions-edit-with-files-in-database/${id}`, { headers: authHeader(),data:data });
};*/

const remove = (questionId) => {
    return axios.delete(API_URL +`user/questions-with-files-in-database/${questionId}`, { headers: authHeader()});
};

const removeAll = () => {
    return axios.delete(API_URL+`user/questions-with-files-in-database`, { headers: authHeader() });

};

const findByTitle = (title) => {
    return axios.get(API_URL+`user/questions-edit-with-files-in-database?title=${title}`);
};

const QuestionService = {
    getAll,
    get,
    create,
    //update,
    remove,
    removeAll,
    createOrUpdateQuestion,
    //createQuestionRelatedToItem,
    //findByTitle,
};

export default QuestionService;