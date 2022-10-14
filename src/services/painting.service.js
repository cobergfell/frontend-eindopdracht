import axios from "axios";
import authHeader from "./auth-header";
import AuthService from "./auth.service";
const currentUser = AuthService.getCurrentUser();

const API_URL = "http://localhost:8080/api/";

const getAll = () => {
    return axios.get(API_URL + "user/paintings", { headers: authHeader() });
};

const get = (paintingId) => {
    const url=API_URL + `user/paintings/${paintingId}`
    console.log('12 url',url)
    return axios.get(url, { headers: authHeader() });
};

const getImage = (paintingId) => {
    const url=API_URL + `user/paintings/image/${paintingId}`
    //const url="http://localhost:8080/api/user/paintings/image/1"
    console.log('18 url',url)
    //let headers=authHeader();
    let config={
        headers: {//'Content-Type': 'multipart/form-data',
            //responseType: 'blob',
            'Content-Type': 'image/jpeg',
            //responseType: 'arraybuffer',

            //'enctype':"multipart/form-data"
        },
        Authorization:`token ${currentUser.accessToken}`
    }

    return axios.get(url, config);
};

//below is an alternatiev to the get function, kept here as example for an alternative method
async function fetchPainting({paintingId,setPainting,setAudioFiles,setError,toggleLoading}) {
    setError(false);
    toggleLoading(true);
    try {
        let filesList=[];
        const result= await axios.get(`http://localhost:8080/api/user/paintings/${paintingId}`, {
            headers: {
                'Authorization': `token ${currentUser.accessToken}`
            }
        }).then(result => {setPainting(result.data);
            //result.data.attachedMusicFiles.map((attachedFile) => {setMusicFilesData(musicFilesData => [...musicFilesData, attachedFile]);})
            //result.data.attachedMusicFiles.map((attachedFile) => {setAudioFiles(audioFiles => [...audioFiles, attachedFile.fileOnDiskUrl]);})
            result.data.attachedMusicFiles.map((attachedFile) => {setAudioFiles(audioFiles => [...audioFiles, attachedFile]);})

            console.log('52 ${paintingId}',`${paintingId}`);
            console.log('53 result.data',result.data);
            toggleLoading(false);
        })
    } catch (e) {
        setError(true);
        toggleLoading(false);
    }
}


const create = (formData,partial_url,config) => {
    try{    const url=`${API_URL+partial_url}`
        console.log('18 url',url)
        return axios.post(url, formData,config);}
        catch (e) {
            console.log('68 error')
    }

};


const update = (paintingId, formData,partial_url,config) => {
    const url=API_URL+partial_url +`/${paintingId}`
    console.log('25 url',url)

    return axios.post(url, formData,config);
};



/*const update = (id, data) => {
    return axios.post(`api/user/questions-edit-with-files-in-database/${id}`, { headers: authHeader(),data:data });
};*/

const remove = (paintingId) => {
    return axios.delete(API_URL +`user/paintings/delete/${paintingId}`, { headers: authHeader()});
};

const removeAll = () => {
    return axios.delete(API_URL+`user/paintings/delete`, { headers: authHeader() });

};

const findByTitle = (title) => {
    return axios.get(API_URL+`user/paintings?title=${title}`);
};


const getPaintingsByQuestionId = (questionId) => {
    return axios.get(API_URL+`user/paintings-by-questionId?questionId=${questionId}`);
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