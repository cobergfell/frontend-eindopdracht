import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory,useParams} from 'react-router-dom';
//import { AuthContext } from '../context/AuthContext';
import DownloadFile from "./DownloadFile";
import AuthService from "../services/auth.service";
import {sortDataBy} from "../services/utilities";

import ListGroup from "react-bootstrap/ListGroup";
//import "bootstrap/dist/css/bootstrap.css"

const currentUser = AuthService.getCurrentUser();


function Question() {
    const [question, setQuestion] = useState(null);
    const [image, setImage] = useState(null);
    const [answers, setAnswers] = useState(null);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status,fileToDownload,setFileToDownload} =  useContext(AuthContext);
    const { id } = useParams();
    const history = useHistory();
    console.log('In Question line 19 id',id);



/*    useEffect(()=>{
        async function fetchImage() {
            setError(false);
            toggleLoading(true);
            try {
                const result = await axios.get(`http://localhost:8080/api/user/questions/image/${id}`, {
                    headers: {
                        'Content-Type': 'image/jpeg',
                        //'Content-Type': 'multipart/form-data',
                        'Authorization': `token ${currentUser.accessToken}`
                    },

                });
                setImage(result.data);
                console.log('28 result.data',result.data);
                toggleLoading(false);

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

    },[]);*/

    useEffect(()=>{
        async function fetchQuestion() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`);
                const result = await axios.get(`http://localhost:8080/api/user/questions?questionId=${id}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                //setQuestion(Object.assign({}, fetchedQuestion));//shallow copy
                //setQuestion(JSON.parse(JSON.stringify(result.data[0])));//deep copy
                setQuestion(result.data[0]);
                console.log('75 result.data[0]',result.data[0]);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
            }
        }
        console.error('37 token',currentUser.accessToken);
        if (currentUser.accessToken) {
            fetchQuestion();
            console.log('50 question',question);
        }

    },[]);

    useEffect(()=>{
        async function fetchAnswers() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`http://localhost:8080/api/user/answers-by-questionId/?questionId=${id}`, {
                const result = await axios.get(`http://localhost:8080/api/user/answers-by-questionId/${id}`, {
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
                console.log('72 e',e);
            }
        }
        console.error('37 token',currentUser.accessToken);
        if (currentUser.accessToken) {
            fetchAnswers();
            console.log('78 answers',answers);
        }

    },[]);



    return (
        <div className="painting-question-container">
            {question &&
            <>
                <div className="add some styling here">
                    <div>
                        <button
                            type="button"
                            className="my-primary-button"
                            //onClick={() => history.push(`/add-answer/${question.questionId}`)}
                            //onClick={() => history.push(`/add-answer/${question.questionId}`,{"bla": "bla"})}
                            onClick={() => history.push({pathname: `/add-answer/${question.questionId}`,
                                search: 'bla',
                                hash: '',
                                state: { answerTo: "question" },
                                key: ''
                            },)}
                        >
                            Send an answer
                        </button>
                    </div>
                </div>

                <div className="page-header">
                    <h1>Question details</h1>

                </div>

                <ul className="my-list-group list-group-horizontal">
                    <li className="my-list-group-item"><strong>Question Id: </strong>{question.questionId}</li>
                    <li className="my-list-group-item"><strong>Title: </strong>{question.title}</li>
                    <li className="my-list-group-item"><strong>Artist: </strong>{question.artist}</li>
                    <li className="my-list-group-item"><strong>Creation Year: </strong>{question.creationYear}</li>
                    <li className="my-list-group-item"><strong>Description: </strong>{question.description}</li>

                </ul>

                 <div className="display-answers">
                     {answers && sortDataBy(answers, "answerId").map((answer)=>
                         <div className="answer-container">
                             <div className="answer-title">
                                 Answer {answer.answerId}: {answer.title}
                             </div>
                             <div className="answer-content">
                                 <p>{answer.content}</p>
                             </div>
                         </div>
                     )}
                     <p>JSON.stringify(answers):{JSON.stringify(answers)}</p>

                 </div>


                <div className="list-title"><strong>File details and download links </strong></div>
                {question && sortDataBy(question.attachedFiles, "Id").map((attachedFile)=> {return (

                    <ul className="my-bullet-list">
                        <li className="my-list-group-item">Id&nbsp;:&nbsp;{attachedFile["id"]}</li>
                        <li className="my-list-group-item">Type&nbsp;&nbsp;:&nbsp;{attachedFile.type}</li>
                        <li className="my-list-group-item">Size (bytes)&nbsp;:&nbsp;{attachedFile.size}</li>
                        <li className="my-list-group-item">Link&nbsp;:&nbsp;
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


                )})}

            </>
            }



            {!question && !error && (
                <span className="no-questions">
          No question available
        </span>
            )}

            {error && <span>Something went wrong with fetching the data.</span>}

            {loading && (<span>Loading...</span>)}
        </div>


    );

}

export default Question;