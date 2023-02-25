import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory,useParams} from 'react-router-dom';
import {sortDataBy} from "../../services/utilities";
import "./conversation.css";
import Button from "../../components/Button/Button";
import AuthService from "../../services/auth.service";

const currentUser = AuthService.getCurrentUser();


function Conversation() {
    const [questions, setQuestions] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [answers, setAnswers] = useState(null);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const { id } = useParams();
    const history = useHistory();

    const assembleConversation = (questions,answers) => {
        setConversation([]);
        if (questions!=null){
            for (let question of sortDataBy(questions, "questionId")) {
                let questionAnswers = {}//create an object which will have two entries: "question" and "answer"
                questionAnswers["question"] = []
                questionAnswers["question"].push(question)
                questionAnswers["questionAnswersId"]=question["questionId"]
                questionAnswers["answers"] = []
                if (answers){
                    for (const answer of answers) {
                        if (answer["questionId"] == question["questionId"]) {
                            questionAnswers["answers"].push(answer)
                        }
                    }
                }
                setConversation(conversation => [...conversation,questionAnswers]);
            }

        }

        return conversation
    }

    async function fetchQuestions() {
        setError(false);
        toggleLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/questions/byPainting/${id}`, {
                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });
            setQuestions(response.data);
            toggleLoading(false);


        } catch (e) {
            setError(true);
            toggleLoading(false);
            console.log('123 e',e);
        }
    }

    async function fetchAnswers() {
        setError(false);
        toggleLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/answers`, {
                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });
            setAnswers(response.data);
            toggleLoading(false);


        } catch (e) {
            setError(true);
            toggleLoading(false);
        }
    }


    useEffect(() => {
        fetchQuestions() .catch(e => {
            console.log('There has been a problem with your fetch operation: ' + e.message);
        });
    }, []);


    useEffect(() => {
        fetchAnswers() .catch(e => {
            console.log('There has been a problem with your fetch operation: ' + e.message);
        });
        //assembleConversation(questions,answers);
    }, []);

    useEffect(() => {
        assembleConversation(questions,answers);
    },[answers,questions]);
    return (
        <div className="conversation-container-flex">
            {conversation && conversation.map((questionAnswerObject)=> {return (
                <>
                    <div className="question-section-title-wrapping">
                        <div className="question-section-title">
                            question
                        </div>
                    </div>

                    <div className="one-question-with-corresponding-answers-container"
                         key={questionAnswerObject["questionAnswerId"]}
                    >
                        <ul className="question-meta-data">
                            <li className="list-item"><strong>Id&nbsp;:&nbsp;</strong>{questionAnswerObject["question"][0]["questionId"]}</li>
                            <li className="list-item"><strong>Sent by&nbsp;:&nbsp;</strong>{questionAnswerObject["question"][0]["username"]}</li>
                            <li className="list--item"><strong>Date sent&nbsp;:&nbsp;</strong>{questionAnswerObject["question"][0]["dateTimePosted"]}</li>
                            <li className="list-item"><strong>Title&nbsp;:&nbsp;</strong>{questionAnswerObject["question"][0]["title"]}</li>
                        </ul>
                        <div className="question-box">
                            {questionAnswerObject["question"][0]["content"]}
                        </div>
                        <div className="question-supplemental-material-box">
                            {questionAnswerObject["question"][0] && sortDataBy(questionAnswerObject["question"][0].attachedFiles, "Id").map((attachedFile)=> {return (
                                <>
                                    <div className="conversation-question-title-list-supplemental-material">
                                        <strong>Supplemental files attached to question</strong>
                                    </div>
                                    <ul className="conversation-question-list-supplemental-material">
                                        <li className="list-item">Id&nbsp;:&nbsp;{attachedFile["id"]}</li>
                                        <li className="list-item">Type&nbsp;&nbsp;:&nbsp;{attachedFile.type}</li>
                                        <li className="list-item">Size (bytes)&nbsp;:&nbsp;{attachedFile.size}</li>
                                        <li className="list-item">Link&nbsp;:&nbsp;
                                            <Link
                                                to={{
                                                    pathname: `/files/${attachedFile["id"]}`,
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



                        {questionAnswerObject["question"][0] && sortDataBy(questionAnswerObject["question"][0].attachedMusicFiles, "Id").map((attachedFile)=> {return (
                            <>
                                <div className="conversation-question-title-list-audio-material">
                                    <strong>Audio files attached to question</strong>
                                </div>
                                <ul className="conversation-question-list-audio-material">
                                    <li className="list-item">Music sample title&nbsp;:&nbsp;{attachedFile.name}</li>
                                    <li className="list-item">
                                        <div className="audio-player">

                                            <audio
                                                src={attachedFile.fileOnDiskUrl}
                                                controls
                                            />
                                        </div>

                                    </li>
                                </ul>
                            </>
                        )})}

                        <div className="answers-section-title-wrapping">
                            <div className="answers-section-title">
                                Answers
                            </div>
                        </div>

                        <div className="answers">
                            {questionAnswerObject["answers"] && questionAnswerObject["answers"].map((answer)=> {return (
                                <div>
                                    <div className="space-in-between">
                                        <br/>
                                        <br/>
                                    </div>
                                    <ul className="answer-meta-data">
                                        <li className="list-item"><strong>Answer</strong></li>
                                        <li className="list-item"><strong>Id&nbsp;:&nbsp;</strong>{answer["answerId"]}</li>
                                        <li className="list-item"><strong>Sent by&nbsp;:&nbsp;</strong>{answer["username"]}</li>
                                        <li className="list--item"><strong>Date sent&nbsp;:&nbsp;</strong>{answer["dateTimePosted"]}</li>
                                        <li className="list-item"><strong>Title&nbsp;:&nbsp;</strong>{answer["title"]}</li>
                                    </ul>
                                    <div className="answer-box">
                                        {answer["content"]}
                                    </div>
                                    <div className="answer-supplemental-material-box">
                                        {answer && sortDataBy(answer.attachedFiles, "Id").map((attachedFile)=> {return (
                                            <>
                                                <div className="conversation-answer-title-list-supplemental-material">
                                                    <strong>Supplemental files attached to answer</strong>
                                                </div>
                                                <ul className="conversation-answer-list-supplemental-material">
                                                    <li className="list-item">Id&nbsp;:&nbsp;{attachedFile["id"]}</li>
                                                    <li className="list-item">Type&nbsp;&nbsp;:&nbsp;{attachedFile.type}</li>
                                                    <li className="list-item">Size (bytes)&nbsp;:&nbsp;{attachedFile.size}</li>
                                                    <li className="list-item">Link&nbsp;:&nbsp;
                                                        <Link
                                                            to={{
                                                                pathname: `/files/${attachedFile["id"]}`,
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



                                    {answer && sortDataBy(answer.attachedMusicFiles, "Id").map((attachedFile)=> {return (
                                        <>

                                            <div className="conversation-question-title-list-audio-material">
                                                <strong>Audio files attached to answer</strong>
                                            </div>

                                            <ul className="conversation-answer-list-audio-material">
                                                <li className="list-item">Music sample title&nbsp;:&nbsp;{attachedFile.name}</li>
                                                <li className="list-item">
                                                    <div className="audio-player">

                                                        <audio
                                                            src={attachedFile.fileOnDiskUrl}
                                                            controls
                                                        />
                                                    </div>

                                                </li>
                                            </ul>

                                        </>
                                    )})}


                                </div>
                            )})}
                        </div>

                        <div className="react-to-question-button-container">

                            <Button
                                className={`btn-basic react-to-question-button`}
                                disabled={false}
                                clickHandler={() => history.push({pathname: `/add-reaction/${questionAnswerObject["question"][0]["questionId"]}`,
                                    search: '',
                                    hash: '',
                                    state: {    answerRelatedTo: "question" ,
                                        reactionType: 'answers',
                                        id:  questionAnswerObject["question"][0]["questionId"],
                                    },
                                    key: ''
                                },)}
                                label={`Add a reaction to this question`}
                            />
                        </div>
                    </div>
                </>
            )})}

            {!conversation && (
                <span className="no-paintings">
                          No conversation available
                        </span>
            )}
        </div>
    );

}

export default Conversation;