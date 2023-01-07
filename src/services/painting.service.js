import axios from "axios";
import authHeader from "./auth-header";
import AuthService from "./auth.service";
const currentUser = AuthService.getCurrentUser();

const API_URL = "http://localhost:8080";

const getAll = () => {
    return axios.get(API_URL + "/paintings", { headers: authHeader() });
};

const get = (id) => {
    const url=API_URL + `/paintings/${id}`
    console.log('url',url)
    return axios.get(url, { headers: authHeader() });
};

const getImage = (id) => {
    const url=API_URL + `/paintings/${id}/image`
    let config={
        headers: { 'Content-Type': 'image/jpeg',
        },
        Authorization:`token ${currentUser.accessToken}`
    }

    return axios.get(url, config);
};

//below is an alternative to the get function, kept here as example for an alternative method
async function fetchPainting({id,setPainting,setAudioFiles,setError,toggleLoading}) {
    setError(false);
    toggleLoading(true);
    try {
        let filesList=[];
        const result= await axios.get(`http://localhost:8080/paintings/${id}`, {
            headers: {
                'Authorization': `token ${currentUser.accessToken}`
            }
        }).then(result => {setPainting(result.data);
            result.data.attachedMusicFiles.map((attachedFile) => {setAudioFiles(audioFiles => [...audioFiles, attachedFile]);})
            toggleLoading(false);
        })
    } catch (e) {
        setError(true);
        toggleLoading(false);
    }
}


const create = (formData,partial_url,config) => {
    try{    const url=`${API_URL+partial_url}`
        return axios.post(url, formData,config);}
        catch (e) {
            console.log('e')
    }
};


const update = (id, formData,partial_url,config) => {
    const url=API_URL+partial_url +`/${id}`
    return axios.post(url, formData,config);
};
const remove = (id) => {
    return axios.delete(API_URL +`paintings/${id}`, { headers: authHeader()});
};

const removeAll = () => {
    return axios.delete(API_URL+`/paintings`, { headers: authHeader() });

};


const getPaintingsByQuestionId = (id) => {
    return axios.get(API_URL+`/paintings/byQuestion?id=${id}`);
};

const PaintingService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    getPaintingsByQuestionId,
    getImage,
    fetchPainting,
};

export default PaintingService;