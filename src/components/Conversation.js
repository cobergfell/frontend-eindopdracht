import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory,useParams} from 'react-router-dom';
import {sortDataBy} from "../services/utilities";
import "../components.styling/conversation-styling.css";
import Button from "../components/Button";
import AuthService from "../services/auth.service";

const currentUser = AuthService.getCurrentUser();


function Conversation({paintingId}) {
    //const [painting, setPainting] = useState(null);
    //const [image, setImage] = useState(null);
    const [questions, setQuestions] = useState(null);
    //const [questionsIds, setQuestionsIds] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [answers, setAnswers] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status,fileToDownload,setFileToDownload} =  useContext(AuthContext);
    const { id } = useParams();
    const history = useHistory();

    console.log('line 27 questions',questions);
    console.log('line 28 conversation',conversation);
    console.log('line 28 paintingId',paintingId);

    // const collectQuestionsIds = () => {
    //     setQuestionsIds(questions => questions.map((question) => {
    //         questionsIds.push(question.questionId)}));
    //     console.log('line 35 questionsIds',questionsIds);
    // };


    const assembleConversation = (questions,answers) => {
        console.log('40 hello 1');
        console.log('41 questions',questions);
        console.log('42 answers',answers);
        setConversation([]);
        if (questions!=null){
            console.log('44 hello 2');
            console.log('45 questions',questions);
        for (let question of sortDataBy(questions, "questionId")) {
        //for (let entry of Object.entries(questions)) {
            //let question=questions[entry]
            let questionAnswers = {}//create an object which will have two entries: "question" and "answer"
            questionAnswers["question"] = []
            questionAnswers["question"].push(question)
            //questionAnswers["question"]=question
            questionAnswers["questionAnswersId"]=question["questionId"]
            console.log('51 questionAnswers',questionAnswers);
            questionAnswers["answers"] = []
            if (answers){
                for (const answer of answers) {
                if (answer["questionId"] == question["questionId"]) {
                    questionAnswers["answers"].push(answer)
                    }
                }
            }


            // if (!Object.keys(questionAnswers).includes("answer")) {
            //     questionAnswers["answer"] = ""
            // }

            setConversation(conversation => [...conversation,questionAnswers]);
            //conversation.push(questionAnswers)

        }

        }

        return conversation
    }

/*        const assembleConversation = () => {
            let questionAnswers = {}//create an object which will have two entries: "question" and "answer"
            questionAnswers["question"] = "question1"
            questionAnswers["answer"] = "answer1"

            setConversation(conversation => [...conversation,questionAnswers]);
            questionAnswers = {}//create an object which will have two entries: "question" and "answer"
            questionAnswers["question"] = "question2"
            questionAnswers["answer"] = "answer2"

            setConversation(conversation => [...conversation,questionAnswers]);
            //conversation.push(questionAnswers)
            console.log('72 conversation',conversation);
            return conversation
        }*/


    //https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
    async function fetchQuestions() {
        console.log('80 hello there');

        setError(false);
        toggleLoading(true);
        try {
            //const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/?paintingId=${id}`, {
            const response = await axios.get(`http://localhost:8080/api/user/questions-by-paintingId/${id}`, {
                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });
            setQuestions(response.data);
            //collectQuestionsIds();
            //console.log('106 questionsIds',questionsIds);

            //setQuestions(questions => [...questions,response.data])
            console.log('96 questions',questions);
            console.log('96 conversation',conversation);
            console.log('96 result.data',response.data);
            console.log('103 bla');

            toggleLoading(false);


        } catch (e) {
            setError(true);
            toggleLoading(false);
            console.log('123 e',e);
        }

    }


    async function fetchAnswers() {
        console.log('129 hello there');

        setError(false);
        toggleLoading(true);
        try {
            //const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/?paintingId=${id}`, {
           // const response = await axios.get(`http://localhost:8080/api/user/answers-by-questionId/${id}`, {
            const response = await axios.get(`http://localhost:8080/api/user/answers`, {
                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });
            setAnswers(response.data);
            //response.data.attachedMusicFiles.map((attachedFile) => {setAudioFiles(audioFiles => [...audioFiles, attachedFile]);})


            //setAnswers(answers => [...answers,response.data])
            console.log('142 answers',answers);
            console.log('144 conversation',conversation);
            console.log('145 result.data',response.data);
            console.log('146 bla');

            toggleLoading(false);


        } catch (e) {
            setError(true);
            toggleLoading(false);
            console.log('142 e',e);
        }
    }

    async function fetchAnswerByQuestionId(id) {
        console.log('129 hello there');

        setError(false);
        toggleLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/user/answers-by-questionId/${id}`, {

                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });
            setAnswer(response.data);
            //response.data.attachedMusicFiles.map((attachedFile) => {setAudioFiles(audioFiles => [...audioFiles, attachedFile]);})


            //setAnswers(answers => [...answers,response.data])
            console.log('142 answers',answer);
            console.log('144 conversation',conversation);
            console.log('145 result.data',response.data);
            console.log('146 bla');

            toggleLoading(false);


        } catch (e) {
            setError(true);
            toggleLoading(false);
            console.log('142 e',e);
        }
    }

    useEffect(() => {
        console.log('152 hello there ');
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
    console.log('181 answers',answers);
    console.log('182 hello there ');


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
                                        state: { answerRelatedTo: "question" ,
                                            responseType: 'answers',
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