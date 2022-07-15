import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory,useParams} from 'react-router-dom';
import {sortDataBy} from "../services/utilities";
import PaintingDataService from "../services/painting.service";
//import { AuthContext } from '../context/AuthContext';
import DownloadFile from "./DownloadFile";
import AuthService from "../services/auth.service";
import {forEach} from "react-bootstrap/ElementChildren";


const currentUser = AuthService.getCurrentUser();


function ConversationOld() {
    //const [painting, setPainting] = useState(null);
    const [image, setImage] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [answers, setAnswers] = useState(null);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status,fileToDownload,setFileToDownload} =  useContext(AuthContext);
    const { id } = useParams();
    const history = useHistory();
    console.log('ConversationOld line 19 conversation',conversation);
    console.log('ConversationOld line 19 questions',questions);

    const assembleConversation = () => {
        for (let question of sortDataBy(questions, "questionId")) {
            let questionAnswerPair = {}//create an object which will have two entries: "question" and "answer"
            questionAnswerPair["question"] = question
            for (const answer of answers) {
                if (answer["questionId"] == question["questionId"]) {
                    questionAnswerPair["answer"] = answer
                }
            }
            if (!questionAnswerPair.keys().includes("answer")) {
                questionAnswerPair["answer"] = ""
            }

            setConversation(conversation => [...conversation,questionAnswerPair]);
            //conversation.push(questionAnswerPair)
            }
        return conversation
        }

    //debut de travaux
    //https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
    async function myFetch() {
        let response = await axios.get(`http://localhost:8080/api/user/questions-by-paintingId/${id}`, {
            headers: {
                'Authorization': `token ${currentUser.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else{setQuestions(response.data);
            console.log('ConversationOld line 61 response.data',response.data);
            console.log('ConversationOld line 61 questions',questions);

        }
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

    // myFetch()
    //     .catch(e => {
    //         console.log('There has been a problem with your fetch operation: ' + e.message);
    //     });

    useEffect(() => {
        myFetch() .catch(e => {
            console.log('There has been a problem with your fetch operation: ' + e.message);
        });
    }, []);

    //fin de travaux
    if (questions) {const conversation=assembleConversation()}
    assembleConversation()
    return (<>
        <div className="painting-question-container">
            {conversation && conversation.map((questionAnswerObject)=> {return (<div>
                <div className="question">
                    <ul className="my-bullet-list">
                        <li
                            className="my-list-group-item">question Id&nbsp;:&nbsp;{questionAnswerObject["question"]["id"]}
                        </li>
                        <li
                            className="my-list-group-item">from&nbsp;:&nbsp;{questionAnswerObject["question"]["username"]}
                        </li>
                        <li
                            className="my-list-group-item">Posted on&nbsp;:&nbsp;{questionAnswerObject["question"]["dateTimePosted"]}
                        </li>
                        <li
                            className="my-list-group-item">Title&nbsp;:&nbsp;{questionAnswerObject["question"]["title"]}
                        </li>
                        <li
                            className="my-list-group-item">Content&nbsp;:&nbsp;{questionAnswerObject["question"]["content"]}
                        </li>
                        <li
                            className="my-list-group-item">Attachments&nbsp;:&nbsp;{questionAnswerObject["question"]["attachedFiles"]}
                        </li>
                    </ul>

                </div>
                <div className="answer">
                    <ul className="my-bullet-list">
                        <li
                            className="my-list-group-item">answer Id&nbsp;:&nbsp;{questionAnswerObject["answer"]["id"]}
                        </li>
                        <li
                            className="my-list-group-item">from&nbsp;:&nbsp;{questionAnswerObject["answer"]["username"]}
                        </li>
                        <li
                            className="my-list-group-item">Posted on&nbsp;:&nbsp;{questionAnswerObject["answer"]["dateTimePosted"]}
                        </li>
                        <li
                            className="my-list-group-item">Title&nbsp;:&nbsp;{questionAnswerObject["answer"]["title"]}
                        </li>
                        <li
                            className="my-list-group-item">Content&nbsp;:&nbsp;{questionAnswerObject["answer"]["content"]}
                        </li>
                        <li
                            className="my-list-group-item">Attachments&nbsp;:&nbsp;{questionAnswerObject["answer"]["attachedFiles"]}
                        </li>
                    </ul>

                </div>
            </div>)})}

            {!conversation && (
                <span className="no-paintings">
          No conversation available
        </span>
            )}


        </div>
        </>
    );

}

export default ConversationOld;