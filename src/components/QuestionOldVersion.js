import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory,useParams} from 'react-router-dom';
//import { AuthContext } from '../context/AuthContext';
import DownloadFile from "./DownloadFile";
import AuthService from "../services/auth.service";
import ListGroup from "react-bootstrap/ListGroup";
//import "bootstrap/dist/css/bootstrap.css"

const currentUser = AuthService.getCurrentUser();


function QuestionOldVersion() {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState(null);

    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status,fileToDownload,setFileToDownload} =  useContext(AuthContext);
    const { id } = useParams();
    const history = useHistory();
    console.log('In Question line 19 id',id);

    useEffect(()=>{
        async function fetchQuestion() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`);
                const result = await axios.get(`http://localhost:8080/api/user/questions-with-files-in-database?questionId=${id}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                //setQuestion(Object.assign({}, fetchedQuestion));//shallow copy
                //setQuestion(JSON.parse(JSON.stringify(result.data[0])));//deep copy
                setQuestion(result.data[0]);
                console.log('28 result.data[0]',result.data[0]);
                toggleLoading(false);

            } catch (e) {
                console.error('36 error in FetchQuestionsFilesInDataBase.js',e);
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
        <div className="questions-overview-wrapper">
            {question &&
            <>
                <div className="d-flex align-items-end justify-content-end">
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => history.push(`/add-answer/${question.questionId}`)}
                        >
                            Send an answer
                        </button>
                    </div>
                </div>

                <div className="page-header">
                    <h1>Question details</h1>
                </div>
                <ul className="list-group list-group-horizontal">
                    <li className="list-group-item"><strong>Question Id: </strong>{question.questionId}</li>
                    <li className="list-group-item"><strong>Tags: </strong>{question.tags}</li>
                </ul>
                <div className="jumbotron">
                    <p>{question.content}</p>
                </div>
                {/*                <p>And here come the answers...</p>
                <p>{JSON.stringify(answers)}</p>*/}
                {answers && answers.map((answer)=>
                    <>
                        <>Answer {answer.answerId}: {answer.title}</>
                        <div className="jumbotron">
                            <p>{answer.content}</p>
                        </div>
                    </>
                )}
            </>
            }

            {question &&

            question.attachedFiles.map((attachedFile) => {

                return (

                    <ListGroup variant="flush">
                        <ListGroup.Item>{JSON.stringify({attachedFile})}</ListGroup.Item>*
                        <ListGroup.Item><strong>File details and download link</strong></ListGroup.Item>
                        <ListGroup.Item>Id&nbsp;:&nbsp;{attachedFile["id"]}</ListGroup.Item>
                        <ListGroup.Item>Type&nbsp;&nbsp;:&nbsp;{attachedFile.type}</ListGroup.Item>
                        <ListGroup.Item>Size (bytes)&nbsp;:&nbsp;{attachedFile.size}</ListGroup.Item>
                        <ListGroup.Item>Link&nbsp;:&nbsp;
                            <Link
                                to={{
                                    pathname: `/files/${attachedFile["id"]}`,
                                    //search: attachedFile.fileId,
                                    //hash: "",
                                    state: { fileName: attachedFile.name }
                                }}
                            >
                                {attachedFile.name}
                            </Link>
                        </ListGroup.Item>
                    </ListGroup>

                )
            })}

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

export default QuestionOldVersion;