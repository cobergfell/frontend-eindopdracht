import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
//import { AuthContext } from '../context/AuthContext';
import './FetchQuestionsFilesInDatabase.css';
import AuthService from "../services/auth.service";
const currentUser = AuthService.getCurrentUser();

//function FetchQuestionsFilesInDataBase({ user }) {
function FetchQuestionsFilesInDataBase() {
    const [questions, setQuestions] = useState(null);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status} =  useContext(AuthContext);



    useEffect(() => {
        async function fetchData() {
            setError(false);
            toggleLoading(true);

            try {
                //const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`);
                const result = await axios.get('http://localhost:8080/api/user/questions-with-files-in-database', {
                    headers: {
                        'Authorization': `token ${currentUser.token}`
                    }
                });
                setQuestions(result.data);
                toggleLoading(false);
                console.log('27 result.data',result.data);
            } catch (e) {
                console.error('31 error in FetchQuestionsFilesInDataBase.js',e);
                setError(true);
                toggleLoading(false);
            }
        }
        console.error('37 token',currentUser.token);
        if (currentUser.token) {
            fetchData();
        }
        console.error('42 questions',questions);
        //fetchData();
    }, []);

    return (
        <div className="questions-overview-wrapper">
            <h1>Questions overview</h1>

            <div className="container">
                <h3 className="table_title">list of questions</h3>
                <table className="questions_table">
                {/*<table className="table">*/}
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title (hyperlink)</th>
                        <th>Sender</th>
                        <th>Link</th>
                        <th>Select</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions && questions.map((question)=>
                        <tr key={question.questionId}>
                            <td>{question.title}
                                <Link to={`questions/${question.questionId}`}>
                                    {question.title}
                                </Link>

                            </td>
                            <td>{question.username}</td>
                            <td>JSON.stringify({question}): {JSON.stringify({question})}</td>
                            <td>{question.url}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {!questions && !error && (
                <span className="no-questions">
          No question available
        </span>
            )}

            {error && <span>Something went wrong with fetching the data.</span>}

            {loading && (<span>Loading...</span>)}
        </div>


    );
}

export default FetchQuestionsFilesInDataBase;