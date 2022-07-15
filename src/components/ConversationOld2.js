import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory,useParams} from 'react-router-dom';
import {sortDataBy} from "../services/utilities";
import "../components.styling/conversation-styling-old.css";
import PaintingDataService from "../services/painting.service";
//import { AuthContext } from '../context/AuthContext';
import DownloadFile from "./DownloadFile";
import AuthService from "../services/auth.service";
import {forEach} from "react-bootstrap/ElementChildren";


const currentUser = AuthService.getCurrentUser();


function ConversationOld2() {
    //const [painting, setPainting] = useState(null);
    //const [image, setImage] = useState(null);
    const [questions, setQuestions] = useState(null);
    //const [questionsIds, setQuestionsIds] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [answers, setAnswers] = useState(null);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status,fileToDownload,setFileToDownload} =  useContext(AuthContext);
    const { id } = useParams();
    const history = useHistory();

    console.log('line 27 questions',questions);
    console.log('line 28 conversation',conversation);


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
            const response = await axios.get(`http://localhost:8080/api/user/answers-by-questionId/${id}`, {

                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });
            setAnswers(response.data);

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

    // fetchQuestions()
    //     .catch(e => {
    //         console.log('There has been a problem with your fetch operation: ' + e.message);
    //     });

    useEffect(() => {
        console.log('152 hello there ');
        fetchQuestions() .catch(e => {
            console.log('There has been a problem with your fetch operation: ' + e.message);
        });
        //assembleConversation(questions,answers);
    }, []);
    console.log('160 questions',questions);
    console.log('170 hello there ');



    useEffect(() => {
        console.log('171 hello there ');
        fetchAnswers() .catch(e => {
            console.log('There has been a problem with your fetch operation: ' + e.message);
        });
        //assembleConversation(questions,answers);
    }, []);
    console.log('181 answers',answers);
    console.log('182 hello there ');


    useEffect(() => {
        console.log('187 questions',questions);
        console.log('188 answers',answers);
        assembleConversation(questions,answers);
        },[answers,questions]);
    console.log('193 conversation',conversation);


    return (<>
                <div className="conversation-container">
                    <div className="inspection-window">
                        {conversation && <p>JSON.stringify(conversation):{JSON.stringify(conversation)}</p>      }
                        {conversation && conversation.map((questionAnswerObject)=> {return (<div>
                            <p>JSON.stringify(questionAnswerObject):{JSON.stringify(questionAnswerObject)}</p>
                        </div>)})}
                    </div>

                    <div className="painting-question-container">
                        {conversation && conversation.map((questionAnswerObject)=> {return (<div>
                            key={questionAnswerObject["questionAnswerId"]}
                            <div className="conversation-list-container">
                                <ul className="list-without-bullets-conversation-type-1">
                                    <li
                                        className="list-group-item-conversation-type-1">question Id&nbsp;:&nbsp;{questionAnswerObject["question"][0]["questionId"]}
                                    </li>
                                    <li
                                        className="list-group-item-conversation-type-1">from&nbsp;:&nbsp;{questionAnswerObject["question"][0]["username"]}
                                    </li>
                                    <li
                                        className="list-group-item-conversation-type-1">Posted on&nbsp;:&nbsp;{questionAnswerObject["question"][0]["dateTimePosted"]}
                                    </li>
                                    <li
                                        className="list-group-item-conversation-type-1">Title&nbsp;:&nbsp;{questionAnswerObject["question"][0]["title"]}
                                    </li>
                                    <li
                                        className="list-group-item-conversation-type-1">Content&nbsp;:&nbsp;{questionAnswerObject["question"][0]["content"]}
                                    </li>
                                    <li
                                       className="my-list-group-item-conversation-type-1">
         {/*                               Attachments&nbsp;:&nbsp;{


                                        questionAnswerObject["question"][0]["attachedFiles"].map((attachedFile) => {

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
                                                </ListGroup>*/}
                                        Attachments&nbsp;:&nbsp;
                                        <table className="attached-files-list-table">
                                            <thead>
                                            <tr>
                                                <th>File Id</th>
                                                <th>Type</th>
                                                <th>Size (kB)</th>
                                                <th>Link</th>
                                            </tr>
                                            </thead>

                                            <tbody>

                                                {questionAnswerObject["question"][0]["attachedFiles"].map((attachedFile) => (
                                                        <tr key={attachedFile["id"]}>
                                                            <td>{attachedFile["id"]}</td>
                                                            <td>{attachedFile.type}</td>
                                                            <td>{attachedFile.size}</td>
                                                            <td>
                                                                <Link className="link-to-file"
                                                                    to={{
                                                                        pathname: `/files/${attachedFile["id"]}`,
                                                                        //search: attachedFile.fileId,
                                                                        //hash: "",
                                                                        state: { fileName: attachedFile.name }
                                                                    }}
                                                                >
                                                                    {attachedFile.name}
                                                                </Link>
                                                            </td>

                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>

                                    </li>
                                    <li className="my-button-wrapper-conversation-type-1">
                                        <button
                                            type="button"
                                            className="my-primary-button"
                                            //onClick={() => history.push(`/add-answer/${painting.paintingId}`)}
                                            //onClick={() => history.push(`/add-answer/${question.questionId}`,{"bla": "bla"})}
                                            onClick={() => history.push({pathname: `/add-answer-to-painting/${questionAnswerObject["question"][0]["questionId"]}`,
                                                search: 'bla',
                                                hash: '',
                                                state: { answerRelatedTo: "question" },
                                                key: ''
                                            },)}
                                        >
                                            Send an answer
                                        </button>
                                    </li>



                                </ul>

                            </div>
                            <div className="answers">

                                    {questionAnswerObject["answers"] && questionAnswerObject["answers"].map((answer)=> {return (<div>
                                            <ul className="list-without-bullets-type-1">
                                                <li
                                                    className="my-list-group-item">answer Id&nbsp;:&nbsp;{answer["answerId"]}
                                                </li>
                                                <li
                                                    className="my-list-group-item">from&nbsp;:&nbsp;{answer["username"]}
                                                </li>
                                                <li
                                                    className="my-list-group-item">Posted on&nbsp;:&nbsp;{answer["dateTimePosted"]}
                                                </li>
                                                <li
                                                    className="my-list-group-item">Title&nbsp;:&nbsp;{answer["title"]}
                                                </li>
                                                <li
                                                    className="my-list-group-item">Content&nbsp;:&nbsp;{answer["content"]}
                                                </li>
                                                {/*<li*/}
                                                {/*    className="my-list-group-item">Attachments&nbsp;:&nbsp;{answer["attachedFiles"]}*/}
                                                {/*</li>*/}
                                            </ul>

                                        </div>)})}
                            </div>
                        </div>)})}

                        {!conversation && (
                            <span className="no-paintings">
                  No conversation available
                </span>
                        )}


                    </div>
            </div>
        </>
    );

}

export default ConversationOld2;