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
    console.log('32 location.state',location.state)
    console.log('33 audioFiles',audioFiles)

    useEffect(()=>{
        async function fetchImage() {
            setError(false);
            toggleLoading(true);
            try {
                const result = await axios.get(`http://localhost:8080/paintings/image?paintingId=${paintingId}`, {

                    headers: {
                        'Content-Type': 'image/jpeg',
                        //'Content-Type': 'multipart/form-data',
                        'Authorization': `token ${currentUser.accessToken}`
                    },

                });
                setImage(result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
            }
        }
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
                const result= await axios.get(`http://localhost:8080/paintings/${paintingId}`, {
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
                const result = await axios.get(`http://localhost:8080/questions/byProject/${paintingId}`, {
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
                const result = await axios.get(`http://localhost:8080/answers/byProject/${paintingId}`, {
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
                        src={`http://localhost:8080/paintings/${paintingId}/image`}/*this works*/
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