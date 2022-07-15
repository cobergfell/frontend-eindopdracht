import React, { useState } from "react";
import AnswerService from "../services/answer.service";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {useHistory, useParams} from "react-router-dom";
const currentUser = AuthService.getCurrentUser();


const AddAnswerOldVersion = () => {
    const initialAnswerState = {
        username: "",
        title: "",
        content: "",
        tags: "",
        files:[],
        //published: false

    };
    const [answer, setAnswer] = useState(initialAnswerState);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const { questionId } = useParams();
    const history = useHistory();
    console.log('23 questionId',questionId)
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
            partial_url=`user/answers-upload-without-files`//+ paramsAsString;
            config={
                headers: {'Content-Type': 'application/json'},
                //Authorization:auth
            }

        } else {
            partial_url=`user/answers-upload-with-files-in-database`//+ paramsAsString;
            config={
                headers: {'Content-Type': 'multipart/form-data'},
                //Authorization:auth
            }
        }


        AnswerService.create(questionId,formData,partial_url,config)
            .then(response => {
                setAnswer(response.data
                    /*                    {username: response.data.username,
                                        title: response.data.title,
                                        content: response.data.content,
                                        tags: response.data.tags,
                                        files: response.data.files}
                                        //published: response.data.published,*/

                );
                setSubmitted(true);
                console.log('80 response',response)
                console.log('80 response.data',response.data);
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
        /*<div className="submit-form">*/
        <div >
            {submitted ? (
                <>

                    <div className="d-flex align-items-end justify-content-end">

                        <div>
                            {/*                           <button className="btn btn-success" onClick={newAnswer}>
                                Add new answer
                            </button>*/}
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={newAnswer}
                            >
                                New answer
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => history.push(`/questions/${questionId}`)}
                            >
                                Back to question
                            </button>
                        </div>
                    </div>
                    <div className="jumbotron">
                        <p>Answer successfully submitted!</p>
                    </div>

                </>
            ) : (
                <div className="submit-form">
                    <h4>Submit a new answer</h4>
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
                        <label htmlFor="description">Content</label>
                        <input
                            type="text"
                            className="form-control"
                            id="content"
                            required
                            value={answer.content}
                            onChange={handleInputChange}
                            name="content"

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

export default AddAnswerOldVersion;
