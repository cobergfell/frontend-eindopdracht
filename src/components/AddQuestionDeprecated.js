import React, { useState } from "react";
import QuestionDataService from "../services/question.service";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {useHistory, useParams} from "react-router-dom";
const currentUser = AuthService.getCurrentUser();

const AddQuestion = () => {

    const initialQuestionState = {
        username: "",
        title: "",
        content: "",
        files:[],
        musicFiles:[],
    };

    const [question, setQuestion] = useState(initialQuestionState);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [selectedMusicFiles, setSelectedMusicFiles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();

    const handleInputChange = event => {
        const { name, value } = event.target;
        setQuestion({ ...question, [name]: value });
        console.log('AddQuestionDeprecated line 25 question',question)
    };

    const fileSelectionHandler = (e) => {
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
    };

    const saveQuestion = () => {

        let formData = new FormData()
        formData.append('title', question.title)
        formData.append('content', question.content)
        //formData.append('files', selectedFiles[0],selectedFiles[0].name)
        formData.append('image',selectedPaintingImage,selectedPaintingImage.name);
        for (const selectedFile of selectedFiles){
            formData.append('files',selectedFile,selectedFile.name);
        }

        for (const selectedMusicFile of selectedMusicFiles){
            formData.append('musicFiles',selectedMusicFile,selectedMusicFile.name);
        }


        formData.append('username', currentUser.username)

        let partial_url=`api/user/question-upload`;
        let config;
        if(selectedFiles.length==0){
            config={
                headers: {'Content-Type': 'application/json'},
                //Authorization:auth
            }
        } else {
            config={
                headers: {'Content-Type': 'multipart/form-data'},
                //Authorization:auth
            }
        }


        QuestionDataService.create(formData,partial_url,config)
            .then(response => {
                setQuestion({
                    username: response.data.username,
                    title: response.data.title,
                    content: response.data.content,
                    files: response.data.files,
                    musicFiles: response.data.musicFiles,
                });
                setSubmitted(true);
                console.log('57 response',response)
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newQuestion = () => {
        setQuestion(initialQuestionState);
        setSubmitted(false);
    };

    return (
        <div className="my-submit-form">
            {submitted ? (
                <>

                    <div className="my-button-wrapper">

                        <div>
                            <button
                                type="button"
                                className="my-primary-button"
                                onClick={newQuestion}
                            >
                                New question
                            </button>

                            <button
                                type="button"
                                className="my-primary-button"
                                onClick={() => history.push("/questionsList/users")}
                            >
                                Question list
                            </button>
                        </div>


                    </div>
                    <div className="message-on-successfully-submitted">
                        <p>Question successfully submitted!</p>
                    </div>

                </>
            ) : (
                <div>
                    <h4>Submit a new Question</h4>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            required
                            value={question.title}
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
                            value={question.description}
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
                            value={question.tags}
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

                    <button onClick={saveQuestion} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddQuestion;
