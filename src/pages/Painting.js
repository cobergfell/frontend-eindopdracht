import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import {sortDataBy} from "../services/utilities";
import AuthService from "../services/auth.service";
import "../pages.styling/painting-styling-grid.css";
//import sound from "C:\\Users\\Gebruiker\\Test\\rachmaninov.mp3";
import Conversation from "../components/Conversation";
import sound from "../assets/Do_Diese_Mineur_lento.mp3";
import Button from "../components/Button";

let audio = new Audio(sound)//test
const start = () => {
    audio.play()
}


function Painting() {
    const currentUser = AuthService.getCurrentUser();
    const history = useHistory();
    const location = useLocation();
    const paintingId = location.state.paintingId;
    const description = location.state.description;
    const hasEditingPrivilege = location.state.hasEditingPrivilege;
    const [painting, setPainting] = useState(null);
    const [image, setImage] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState(null);
    const [audioFiles, setAudioFiles] = useState([]);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);


    useEffect(()=>{
        async function fetchImage() {
            setError(false);
            toggleLoading(true);
            try {
                const result = await axios.get(`http://localhost:8080/api/user/paintings/image?paintingId=${paintingId}`, {

                    headers: {
                        'Content-Type': 'image/jpeg',
                        //'Content-Type': 'multipart/form-data',
                        'Authorization': `token ${currentUser.accessToken}`
                    },

                });
                setImage(result.data);
                console.log('61 result.data',result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
            }
        }
        console.error('69 token',currentUser.accessToken);
        if (currentUser.accessToken) {
            fetchImage();
        }

    },[]);

    useEffect(()=>{
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
                    result.data.attachedMusicFiles.map((attachedFile) => {setAudioFiles(audioFiles => [...audioFiles, attachedFile]);})
                    toggleLoading(false);
                })
            } catch (e) {
                setError(true);
                toggleLoading(false);
            }
        }
        if (currentUser.accessToken) {
            fetchPainting();
        }
    },[]);

    useEffect(()=>{
        async function fetchQuestions() {
            setError(false);
            toggleLoading(true);
            try {
                const result = await axios.get(`http://localhost:8080/api/user/questions-by-paintingId/${paintingId}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                setQuestions(result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
            }
        }
        if (currentUser.accessToken) {
            fetchQuestions();
        }

    },[]);




    useEffect(()=>{
        async function fetchAnswers() {
            setError(false);
            toggleLoading(true);
            try {
                const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/${paintingId}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                setAnswers(result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
                console.log('e',e);
            }
        }
        if (currentUser.accessToken) {
            fetchAnswers();
        }

    },[]);

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


    return (
        <div className="painting-container-grid">

            {painting &&
            <>
                <Button
                    className={`btn-basic send-question-button`}
                    disabled={false}
                    clickHandler={() => history.push({pathname: `/add-reaction/${painting.paintingId}`,
                        search: '',
                        hash: '',
                        state: {
                            questionRelatedTo: "painting",
                            reactionType: 'questions',
                            id:paintingId,
                            //description:description,
                        },
                        key: ''
                    },)}
                    label={`Send question`}
                />



                {hasEditingPrivilege==true &&  (

                    <Button
                    className={`btn-basic edit-project-button`}
                    disabled={false}
                    clickHandler={() => history.push({pathname: `/edit/painting/${location.state.paintingId}`,
                    search: '',
                    hash: '',
                    state: { paintingId: location.state.paintingId,
                    description: location.state.description,
                },
                    key: ''
                },)}
                    label={`Edit project`}
                    />



                )}

                <div className="image-container-grid">
                    <img
                        className="image"
                        alt="myImage"
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
                </ul>



                <div className="painting-supplemental-material-box">
                    <div className="title-supplemental-material-box">
                        <strong>Supplemental files</strong>
                    </div>
                    {painting && sortDataBy(painting.attachedFiles, "Id").map((attachedFile)=> {return (
                        <>
                            <ul className="list-supplemental-material">
                                <li className="list-item">Id&nbsp;:&nbsp;{attachedFile["id"]}</li>
                                <li className="list-item">Type&nbsp;&nbsp;:&nbsp;{attachedFile.type}</li>
                                <li className="list-item">Size (bytes)&nbsp;:&nbsp;{attachedFile.size}</li>
                                <li className="list-item">Link&nbsp;:&nbsp;
                                    <Link
                                        to={{
                                            pathname: `/files/${attachedFile["id"]}`,
                                            state: { fileName: attachedFile.name,paintingId: paintingId}
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
                    <div className="title-audio-material-box">
                        <strong>Audio files</strong>
                    </div>
                    {audioFiles && audioFiles.map((audioFile)=> {return (
                        <>
                            <ul className="list-audio-data">
                                <li className="list-item">Music sample title&nbsp;:&nbsp;{audioFile.name}</li>
                                <li className="list-item">
                                    <div className="audio-player">

                                        <audio
                                            src={audioFile.fileOnDiskUrl}
                                            //src={'http://localhost:8080/api/user/download-file-from-disk/1'}//this should work as well
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
                    <strong>Blog</strong>
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