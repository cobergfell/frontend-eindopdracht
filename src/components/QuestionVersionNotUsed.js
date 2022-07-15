import React, { useState, useEffect } from "react";
import QuestionService from "../services/question.service";
import AuthService from "../services/auth.service";
import FilesList from "./FilesList";
import {Link} from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
const currentUser = AuthService.getCurrentUser();

const QuestionVersionNotUsed = props => {

    const initialQuestionState = {
        questionId: null,
        username: "",
        title: "",
        content: "",
        tags: "",
        files:[],
        //published: false
    };

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(initialQuestionState);

    const [message, setMessage] = useState("");

    /*    const getSelectedFiles = (files) => {
            for (const file of files){
            setSelectedFiles(selectedFiles => [...selectedFiles, file]);
            return setSelectedFiles
        };

        const getSelectedFiles_alternative_version = files.map(file=> [...selectedFiles, file]);
            return setSelectedFiles
            };*/


    const getQuestion = questionId => {
        QuestionService.get(questionId)
            .then(response => {
                setCurrentQuestion({
                    questionId: response.data.questionId,
                    username: response.data.username,
                    title: response.data.title,
                    content: response.data.content,
                    tags: response.data.tags,
                    //published: response.data.published,
                    files: response.data.attachedFiles
                });

                console.log(response.data);
                console.log('currentQuestion line 47 response.data',response.data)

            })
            .catch(e => {
                console.log(e);
            });
    };


    useEffect(() => {
        getQuestion(props.match.params.id);
    }, [props.match.params.id]);


    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentQuestion({ ...currentQuestion, [name]: value });
    };

    const fileSelectionHandler = (e) => {
        console.log("In EditQuestion line 68 e.target.files[0]",e.target.files[0])
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
        console.log("In EditQuestion line 68 selectedFile",selectedFiles);

    };


    const updatePublished = status => {
        let data = {
            questionId: currentQuestion.questionId,
            username: currentQuestion.username,
            title: currentQuestion.title,
            content: currentQuestion.content,
            tags: currentQuestion.tags,
            published: currentQuestion.published,
            files: currentQuestion.files
        };
        setSelectedFiles(currentQuestion.files)
        QuestionService.update(currentQuestion.id,  data)
            .then(response => {
                setCurrentQuestion({ ...currentQuestion, published: status });
                console.log(response.data);
                setMessage("The status was updated successfully!");
            })
            .catch(e => {
                console.log(e);
            });
    };

    const updateQuestion = () => {

        console.log("In EditQuestion line 97 currentQuestion.questionId",currentQuestion.questionId);
        let formData = new FormData()
        formData.append('questionId', currentQuestion.questionId)
        formData.append('username', currentQuestion.username)
        formData.append('title', currentQuestion.title)
        formData.append('content', currentQuestion.content)
        formData.append('tags', currentQuestion.tags)
        //formData.append('files', selectedFiles[0],selectedFiles[0].name)
        for (const selectedFile of selectedFiles){
            console.log("In EditQuestion line 106 selectedFile",selectedFile);
            formData.append('files',selectedFile,selectedFile.name);
        }

        let partial_url;
        let config;
        //const auth= authHeader().Authorization;
        //const paramsAsString = new URLSearchParams(data).toString();
        console.log("In EditQuestion line 113 selectedFiles",selectedFiles);
        console.log("In EditQuestion line 113 electedFiles.length==0",selectedFiles.length==0);
        //const user = JSON.parse(localStorage.getItem('user'));
        if(selectedFiles.length==0){
            partial_url="user/questions-edit-without-files/"
            config={
                headers: {'Content-Type': 'application/json'},
                //Authorization: auth
            }

        } else {
            partial_url="user/questions-edit-with-files/"//+ paramsAsString;
            config={
                headers: {'Content-Type': 'multipart/form-data'},
                //Authorization:auth
            }
        }
        console.log("In EditQuestion line 128 currentQuestion.id",currentQuestion.id);
        QuestionService.update(currentQuestion.id, formData,partial_url,config)
            .then(response => {
                setCurrentQuestion({
                    questionId: response.data.questionId,
                    username: response.data.username,
                    title: response.data.title,
                    content: response.data.content,
                    tags: response.data.tags,
                    //published: response.data.published,
                    files: response.data.attachedFiles
                });
                setMessage("The EditQuestion was updated successfully!");
            })
            .catch(e => {
                console.log(e);
            });
    };


    const deleteQuestion = () => {
        QuestionService.remove(currentQuestion.questionId)
            .then(response => {
                console.log(response.data);
                props.history.push("/questions");
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div>
            {currentQuestion ? (

                <div className="edit-form">
                    <h4>Question</h4>
                    {/*<h4>{JSON.stringify(currentQuestion)}</h4>*/}
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={currentQuestion.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                value={currentQuestion.content}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">Tags</label>
                            <input
                                type="text"
                                className="form-control"
                                id="tags"
                                //required
                                value={currentQuestion.tags}
                                onChange={handleInputChange}
                                name="tags"

                            />
                        </div>



                        <div className="form-group">
                            <label>
                                <strong>Status:</strong>
                            </label>
                            {currentQuestion.published ? "Published" : "Pending"}
                        </div>

                        <div className="">
                            <label>
                                Select Files:
                            </label>
                            <input type="file" name="files" multiple onChange={fileSelectionHandler}/>
                        </div>


                    </form>

                    {currentQuestion.published ? (
                        <button
                            className="badge badge-primary mr-2"
                            onClick={() => updatePublished(false)}
                        >
                            UnPublish
                        </button>
                    ) : (
                        <button
                            className="badge badge-primary mr-2"
                            onClick={() => updatePublished(true)}
                        >
                            Publish
                        </button>
                    )}

                    <button className="badge badge-danger mr-2" onClick={deleteQuestion}>
                        Delete
                    </button>

                    <button
                        type="submit"
                        className="badge badge-success"
                        onClick={updateQuestion}
                    >
                        Update
                    </button>
                    <p>{message}</p>
                </div>
            ) : (
                <div>
                    <br />
                    <p>Please click on a Question...</p>
                </div>
            )}


            {(Object.entries(currentQuestion.files).length !== 0 || currentQuestion.files===undefined) && (
                <div className="display-questions">
                    <p><strong>Attached files: </strong></p>
                    <p><strong>bla{JSON.stringify(currentQuestion.files)}</strong></p>
                    <>
                        <ul>
                            {currentQuestion.files.map((selectedFile) => {
                                    return (
                                        <li key={`${selectedFile.name}`}>
                                            {selectedFile.name}
                                        </li>
                                    )
                                }
                            )}
                        </ul>


                        <div className="link-wrapper-chob-draft-1">
                            <Link
                                to={{
                                    pathname: `/question_files_list`,
                                    //search: attachedFile.fileId,
                                    //hash: "",
                                    state: { questionFiles: currentQuestion.files }
                                }}
                            >
                                Go to files
                            </Link>
                            {/*<FilesList key={currentQuestion.name} questionFiles={currentQuestion.files} />*/}

                        </div>
                    </>
                </div>
            )}

        </div>
    );
};

export default QuestionVersionNotUsed;
