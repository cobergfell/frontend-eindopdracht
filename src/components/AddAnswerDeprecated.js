import React, { useState } from "react";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {useHistory, useLocation, useParams} from "react-router-dom";
import AnswerService from "../services/answer.service";
const currentUser = AuthService.getCurrentUser();

const AddAnswerDeprecated = () => {

    const initialAnswerState = {
        username: "",
        title: "",
        description: "",
        tags: "",
        answerTo:"question",
        files:[],
        //published: false

    };
    const [answer, setAnswer] = useState(initialAnswerState);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();
    const { id } = useParams();
    const location = useLocation();
    const answerTo = location.state.answerTo;

    console.log('28 id',id)
    console.log('29 location',location)
    console.log('29 answerTo',answerTo)

    const handleInputChange = event => {
        const { name, value } = event.target;
        setAnswer({ ...answer, [name]: value });
        console.log('AddAnswerDeprecated line 25 answer',answer)
    };

    const fileSelectionHandler = (e) => {
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
    };

    const saveAnswer = () => {

        let formData = new FormData()
        formData.append('title', answer.title)
        formData.append('content', answer.content)
        formData.append('tags', answer.tags)
        if(answerTo=='painting'){formData.append('answerTo', 'painting')}
        else{formData.append('answerTo', 'question')}

        //formData.append('files', selectedFiles[0],selectedFiles[0].name)
        for (const selectedFile of selectedFiles){
            formData.append('files',selectedFile,selectedFile.name);
        }

        formData.append('username', currentUser.username)

        let partial_url;
        let config;
        //const auth= authHeader().Authorization;
        //const paramsAsString = new URLSearchParams(data).toString();
        console.log('49 selectedFiles',selectedFiles)
        if(selectedFiles.length==0){
            partial_url=`user/answers-upload-without-files`
            config={headers: {'Content-Type': 'application/json'},}

        } else {
            partial_url=`user/answers-upload-with-files-in-database`
            config={headers: {'Content-Type': 'multipart/form-data'},}
        }


        AnswerService.create(id,formData,partial_url,config)
            .then(response => {
                setAnswer({
                    username: response.data.username,
                    title: response.data.title,
                    description: response.data.description,
                    tags: response.data.tags,
                    answerTo: response.data.answerTo,
                    files: response.data.files,
                    //published: response.data.published,

                });
                setSubmitted(true);
                console.log('57 response',response)
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newAnswer = () => {
        setAnswer(initialAnswerState);
        setSubmitted(false);
    };

    return (
        <div className="my-submit-form">
            {submitted ? (
                <>

                    <div className="my-button-wrapper-within-form">

                        <button
                            type="button"
                            className="my-primary-button"
                            onClick={newAnswer}
                        >
                            New Answer
                        </button>


                        {(answerTo=="painting")?(
                            <>
                                <button
                                    type="button"
                                    className="my-primary-button"
                                    onClick={() => history.push("/paintingsList/users")}
                                >
                                    Answer list
                                </button>
                            <button
                                type="button"
                                className="my-primary-button"
                                onClick={() => history.push(`/paintings/${id}`)}
                            >
                                Back to painting
                            </button>
                            </>
                        ):(
                            <>
                                <button
                                    type="button"
                                    className="my-primary-button"
                                    onClick={() => history.push("/questionsList/users")}
                                >
                                    Answer list
                                </button>
                                <button
                                    type="button"
                                    className="my-primary-button"
                                    onClick={() => history.push(`/questions/${id}`)}
                                >
                                    Back to question
                                </button>
                            </>

                        )
                        }


                    </div>
                    <div className="message-on-successfully-submitted">
                        <p>Answer successfully submitted!</p>
                    </div>

                </>
            ) : (
                <div>
                    <h4>Submit a new Answer</h4>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            required
                            value={answer.title}
                            onChange={handleInputChange}
                            name="title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            required
                            value={answer.description}
                            onChange={handleInputChange}
                            name="description"

                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tags"
                            //required
                            value={answer.tags}
                            onChange={handleInputChange}
                            name="tags"

                        />
                    </div>

                    <div className="">
                        <label>
                            Select Files:
                        </label>
                        <input type="file" name="files" multiple onChange={fileSelectionHandler}/>
                    </div>
                    {/*                    <button type='submit'>Upload</button>
                    <br/>*/}
                    <p><strong>Attached files: </strong></p>
                    <ul>
                        {selectedFiles.map((selectedFile) => {
                            return (
                                <li key={`${selectedFile.name}`}>
                                    {selectedFile.name}
                                </li>
                            )
                        })}
                    </ul>

                    <button onClick={saveAnswer} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddAnswerDeprecated;
