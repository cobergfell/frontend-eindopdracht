import React, { useState, useEffect, useMemo, useRef } from "react";
import QuestionDataService from "../services/question.service";
import { useTable } from "react-table";
import axios from "axios";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import {Link, useHistory} from "react-router-dom";
const currentUser = AuthService.getCurrentUser();


const QuestionsList = (props) => {
    const [questions, setQuestions] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const questionsRef = useRef();
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const history = useHistory();

    questionsRef.current = questions;

    useEffect(() => {
        retrieveQuestions();
    }, []);

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const retrieveQuestions = () => {
        QuestionDataService.getAll()
            .then((response) => {
                console.log('34 response.data',response.data);
                setQuestions(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveQuestions();
    };

    const removeAllQuestions = () => {
        QuestionDataService.removeAll()
            .then((response) => {
                console.log(response.data);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByTitle = () => {
        QuestionDataService.findByTitle(searchTitle)
            .then((response) => {
                setQuestions(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const openQuestion = (questionId) => {
        let path= "/questions/" + questionId.toString()
        history.push(path);
    };

    const deleteQuestion = (rowIndex) => {
        const id = questionsRef.current[rowIndex].id;

        QuestionDataService.remove(id)
            .then((response) => {
                history.push("/questions");

                let newQuestions = [...questionsRef.current];
                newQuestions.splice(rowIndex, 1);

                setQuestions(newQuestions);
            })
            .catch((e) => {
                console.log(e);
            });
    };



    return (<div >

        {/*        (questions===undefined) &&
       ( <p>JSON.stringify({questions}): {JSON.stringify({questions})}</p>)*/}
        <table className="display-questions-list">
            <thead>
            <tr>
                <th>QuestionId</th>
                <th>Sender</th>
                <th>Posted on (GMT)</th>
                <th>Action</th>
                <th>JSON.stringify(question)</th>
            </tr>
            </thead>

            <tbody>

            {questions.map((question) => (
                <tr key={question.questionId}>
                    <td>{question.questionId}</td>
                    <td>{question.username}</td>
                    <td>{question.dateTimePosted}</td>
                    <td>
                        <div>
                              <span onClick={() => openQuestion(question.questionId)}
                                    className="actions"
                              >
                                <i className="far fa-edit action mr-2">display</i>
                              </span>
                            <span onClick={() => deleteQuestion(question.questionId)}
                                  className="actions"
                            >
                                <i className="fas fa-trash action">delete</i>
                              </span>
                            <span
                                onClick={() => alert('Hello from line 120')}
                                className="actions"
                            >
                                Hello
                              </span>
                        </div>

                    </td>
                    <td>{JSON.stringify({question})}</td>

                </tr>
            ))}

            </tbody>
        </table>


    </div>);

};

export default QuestionsList;