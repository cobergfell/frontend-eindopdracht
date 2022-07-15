import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import {sortDataBy} from "../services/utilities";
import AuthService from "../services/auth.service";
import "../components.styling/painting-styling-flex-deprecated.css";
import "../components.styling/painting-styling-grid.css";
import sound from "C:\\Users\\Gebruiker\\Test\\rachmaninov.mp3";
import Conversation from "./Conversation";
//import sound from "../assets/Do_Diese_Mineur_lento.mp3";//test
import PaintingDataService from "../services/painting.service";
//import { AuthContext } from '../context/AuthContext';
import DownloadFile from "./DownloadFile";

//test

const currentUser = AuthService.getCurrentUser();

let audio = new Audio(sound)//test
const start = () => {
    audio.play()
}


function Painting() {
    const history = useHistory();
    const [anotherState, setAnotherState] = useState(null);
    const location = useLocation();
    const paintingId = location.state.paintingId;
    const description = location.state.description;
    const hasEditingPrivilege = location.state.hasEditingPrivilege;
    const [painting, setPainting] = useState(null);
    const [descriptionState, setDescriptionState] = useState(null);
    const [image, setImage] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState(null);
    //const [musicFilesData, setMusicFilesData] = useState([]);
    const [audioFiles, setAudioFiles] = useState([]);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status,fileToDownload,setFileToDownload} =  useContext(AuthContext);
    //const { paintingId } = useParams();//we don't use it now because we infer paintingId from location state
    console.log('In Painting line 37 paintingId',paintingId);
    console.log('line 38 description',description)
    console.log('line 39 audioFiles',audioFiles)


    const onChangeDoSomething = (e) => {
        const anotherState = e.target.value;
        setAnotherState(anotherState);
    };

    useEffect(()=>{
        async function fetchImage() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&apppaintingId=${apiKey}&lang=nl`);
                const result = await axios.get(`http://localhost:8080/api/user/paintings/image?paintingId=${paintingId}`, {

                    headers: {
                        'Content-Type': 'image/jpeg',
                        //'Content-Type': 'multipart/form-data',
                        'Authorization': `token ${currentUser.accessToken}`
                    },

                });
                setImage(result.data);
                console.log('28 result.data',result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
            }
        }
        console.error('37 token',currentUser.accessToken);
        if (currentUser.accessToken) {
            fetchImage();
            console.log('44 image',image);
        }

    },[]);

    useEffect(()=>{
        // to do: this function below still needs to be replaced by get(id) from painting.service, see component EditPaintingOld.js
        async function fetchPainting() {
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

                    console.log('96 ${paintingId}',`${paintingId}`);
                    console.log('97 result.data',result.data);
                    toggleLoading(false);
                })
            } catch (e) {
                setError(true);
                toggleLoading(false);
            }
        }
        console.error('37 token',currentUser.accessToken);
        if (currentUser.accessToken) {
            fetchPainting();
            console.log('50 painting',painting);
        }

    },[]);

    useEffect(()=>{
        async function fetchQuestions() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/?paintingId=${paintingId}`, {
                const result = await axios.get(`http://localhost:8080/api/user/questions-by-paintingId/${paintingId}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                setQuestions(result.data);
                console.log('67 result.data',result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
                console.log('72 e',e);
            }
        }
        console.error('37 token',currentUser.accessToken);
        if (currentUser.accessToken) {
            fetchQuestions();
            console.log('118 questions',questions);
        }

    },[]);




    useEffect(()=>{
        async function fetchAnswers() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/?paintingId=${paintingId}`, {
                const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/${paintingId}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                setAnswers(result.data);
                console.log('67 result.data',result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
                console.log('142 e',e);
            }
        }
        console.error('37 token',currentUser.accessToken);
        if (currentUser.accessToken) {
            fetchAnswers();
            console.log('78 answers',answers);
        }

    },[]);


    //debut de travaux
    //https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
    async function myFetch() {
        let response = await axios.get(`http://localhost:8080/api/user/questions-by-paintingId/${paintingId}`, {
            headers: {
                'Authorization': `token ${currentUser.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else{setQuestions(response.data);}
        const questionsIdList=[]
        let myListOfIds = await response.data.map((question) => { questionsIdList.push(question.questionId) })
        for (let id of questionsIdList) {
            let response = await axios.get(`http://localhost:8080/api/user/answers-by-questionId/${id}`, {
                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else{setAnswers(response.data);}
        }

    }


    /*    useEffect(() => {
            myFetch() .catch(e => {
                console.log('There has been a problem with your fetch operation: ' + e.message);
            });
        }, []);*/


    return (
        <div className="painting-container-grid">
            {/*<div className="myGridTest">*/}
            {/*    myGridTest*/}
            {/*</div>*/}


            {painting &&
            <>
                {/*<p>JSON.stringify(painting):{JSON.stringify(painting)}</p>*/}
                <button
                    type="button"
                    className="send-question-button"
                    onClick={() => history.push({pathname: `/add-question-to-project/${painting.paintingId}`,
                        search: 'bla',
                        hash: '',
                        state: {
                            questionRelatedTo: "painting",
                            paintingId:paintingId,
                            description:description,
                        },
                        key: ''
                    },)}
                >
                    Send question
                </button>
                <button
                    type="button"
                    className="conversation-button"
                    //onClick={() => history.push(`/add-answer/${painting.paintingId}`)}
                    //onClick={() => history.push(`/add-answer/${question.questionId}`,{"bla": "bla"})}
                    onClick={() => history.push({pathname: `/conversation/${painting.paintingId}`,
                        search: '',
                        hash: '',
                        state: { about: "painting" },
                        key: ''
                    },)}
                >
                    Blog page
                </button>


                {hasEditingPrivilege==true &&  (
                    <button
                        type="button"
                        className="edit-project-button"
                        //onClick={() => history.push(`/add-answer/${painting.paintingId}`)}
                        onClick={() => history.push({pathname: `/edit/painting/${location.state.paintingId}`,
                            search: 'bla',
                            hash: '',
                            state: { paintingId: location.state.paintingId,
                                description: location.state.description,
                            },
                            key: ''
                        },)}
                    >
                        Edit project
                    </button>
                )}



                <div className="image-container-grid">
                    <img
                        className="image"
                        alt="blablablabla"
                        src={`http://localhost:8080/api/user/paintings/image/${paintingId}`}/*this works*/
                    />
                </div>

                <div className="title-painting-data-box">
                    <strong>Painting data</strong>
                </div>

                <ul className="list-painting-data">
                    <li className="list-item"><strong>Painting Id: </strong>{paintingId}</li>
                    <li className="list-item"><strong>Sent by: </strong>{painting.username}</li>
                    <li className="list--item"><strong>Date sent: </strong>{painting.dateTimePosted}</li>
                    <li className="list-item"><strong>Title: </strong>{painting.title}</li>
                    <li className="list-item"><strong>Artist: </strong>{painting.artist}</li>
                    {/*<li className="list-summarize-painting-data-item"><strong>Description: </strong>{painting.description}</li>*/}
                </ul>



                <div className="painting-supplemental-material-box">
                    {painting && sortDataBy(painting.attachedFiles, "Id").map((attachedFile)=> {return (
                        <>
                            <div className="title-supplemental-material-box">
                                <strong>Supplemental files</strong>
                            </div>
                            <ul className="list-supplemental-material">
                                <li className="list-item">Id&nbsp;:&nbsp;{attachedFile["id"]}</li>
                                <li className="list-item">Type&nbsp;&nbsp;:&nbsp;{attachedFile.type}</li>
                                <li className="list-item">Size (bytes)&nbsp;:&nbsp;{attachedFile.size}</li>
                                <li className="list-item">Link&nbsp;:&nbsp;
                                    <Link
                                        to={{
                                            pathname: `/files/${attachedFile["id"]}`,
                                            //search: attachedFile.fileId,
                                            //hash: "",
                                            state: { fileName: attachedFile.name }
                                        }}
                                        style={{color: 'deepskyblue'}}
                                    >
                                        {attachedFile.name}
                                    </Link>
                                </li>
                            </ul>
                        </>
                    )})}
                </div>

                <div className="audio-material">
                    {audioFiles && audioFiles.map((audioFile)=> {return (
                        <>
                            <div className="title-audio-material-box">
                                <strong>Audio files</strong>
                            </div>
                            <ul className="list-audio-data">
                                <li className="list-item">Music sample title&nbsp;:&nbsp;{audioFile.name}</li>
                                <li className="list-item">
                                    <div className="audio-player">

                                        <audio
                                            src={audioFile.fileOnDiskUrl}
                                            //src={'http://localhost:8080/api/user/download-file-from-disk/1'}//this works
                                            //autoPlay
                                            controls
                                        />
                                    </div>

                                </li>
                            </ul>
                        </>
                    )})}
                </div>

                <div className="title-blog-box">
                    <strong>Blog at a glance</strong>
                </div>

                <div className="blog-box">
                    <div className="initial-description">
                        {painting.description}
                    </div>
                    <Conversation
                        paintingId={painting.paintingId}
                    />
                </div>

            </>
            }

            {!painting && !error && (
                <span className="no-paintings">
          No painting available
        </span>
            )}
            {loading && (<span>Loading...</span>)}
        </div>


    );

}

export default Painting;