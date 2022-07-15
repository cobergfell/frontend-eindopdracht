import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import QuestionService from "../services/question.service";
import "../components.styling/add-question-styling-grid.css";
//import {Button} from "react-bootstrap";

const currentUser = AuthService.getCurrentUser();


const AddQuestion = () => {

    const initialQuestionState = {
        username: "",
        title: "",
        content: "",
        tags: "",
        questionRelatedTo:"painting",
        files:[],

    };
    const [question, setQuestion] = useState(initialQuestionState);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [selectedMusicFiles, setSelectedMusicFiles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [preview, setPreview] = useState()
    const history = useHistory();
    const { id } = useParams();// here it would be better to drop id  as param and work only with  paintingId, but I keep it like this to keep an example of how to use useParam
    const location = useLocation();
    const questionRelatedTo = location.state.questionRelatedTo;
    const paintingId = location.state.paintingId;
    const description = location.state.description;
    // const [painting, setPainting] = useState(null);
    // const [descriptionState, setDescriptionState] = useState(null);
    const hiddenFileInput1 = React.useRef(null);
    const hiddenFileInput2 = React.useRef(null);
    const hiddenFileInput3 = React.useRef(null);


    console.log('28 id',id)
    console.log('29 location',location)
    console.log('29 questionRelatedTo',questionRelatedTo)

    const handleInputChange = event => {
        const { name, value } = event.target;
        setQuestion({ ...question, [name]: value });
        console.log('AddQuestionDeprecated line 25 question',question)
    };

    const fileSelectionHandler = (e) => {
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
    };


    useEffect(() => {
        if (!selectedPaintingImage) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedPaintingImage)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedPaintingImage])


    const handleClick1 = event => {
        hiddenFileInput1.current.click();
    }
    const handleClick2 = event => {
        hiddenFileInput2.current.click();
    }
    const handleClick3 = event => {
        hiddenFileInput3.current.click();
    }

    const paintingImageSelectionHandler = (e) => {
        //alert('hello there!')
        console.log('61 e.target',e.target)
        setSelectedPaintingImage(e.target.files[0]);
        console.log('63 selectedPaintingImage',selectedPaintingImage)
        setPreview(e.target.files[0]);

    };

    const audiFileSelectionHandler = (e) => {
        //const fileName=cleanFileName(e.target.files[0].name)
        //console.log('56 fileName',fileName)

        console.log('67 e.target.files',e.target.files)
        setSelectedMusicFiles(selectedMusicFiles => [...selectedMusicFiles, e.target.files[0]]);
    };





    const saveQuestion = () => {

/*        formData.append('title', question.title)
        formData.append('content', question.content)
        formData.append('image',selectedPaintingImage,selectedPaintingImage.name);
        for (const selectedFile of selectedFiles){
            formData.append('files',selectedFile,selectedFile.name);
        }
        for (const selectedMusicFile of selectedMusicFiles){
            formData.append('musicFiles',selectedMusicFile,selectedMusicFile.name);
        }*/

        let formData = new FormData()

        if (question.title!=null){
            formData.append('title', question.title)
        }
        if (question.content!=null){
            formData.append('content', question.content)
        }

        if (selectedPaintingImage!=null){
            formData.append('image',selectedPaintingImage,selectedPaintingImage.name);
        }
        if (selectedFiles!=[]){
            for (const selectedFile of selectedFiles){
                //first clean file name
                formData.append('files',selectedFile,selectedFile.name);
            }
        }
        if (selectedMusicFiles!=[]){
            for (const selectedMusicFile of selectedMusicFiles){
                //first clean file name
                formData.append('musicFiles',selectedMusicFile,selectedMusicFile.name);
            }
        }


        formData.append('username', currentUser.username)

        let partial_url;
        let config;
        //const auth= authHeader().Authorization;
        //const paramsAsString = new URLSearchParams(data).toString();
        console.log('49 selectedFiles',selectedFiles)
        if(selectedFiles.length==0){
            config={headers: {'Content-Type': 'application/json'},}

        } else {
            config={headers: {'Content-Type': 'multipart/form-data'},}
        }
        partial_url=`user/question-upload/${id}`
        QuestionService.createOrUpdateQuestion(formData,partial_url,config)
            .then(response => {
                setQuestion({
                    username: response.data.username,
                    title: response.data.title,
                    content: response.data.content,
                    tags: response.data.tags,
                    questionRelatedTo: response.data.questionRelatedTo,
                    files: response.data.files,
                    idRelatedItem:response.data.idRelatedItem,
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

    const newQuestion = () => {
        setQuestion(initialQuestionState);
        setSubmitted(false);
    };

    return (
        <div className="container-grid">
            {submitted ? (
                <>
                    <button
                        type="button"
                        className="on-success-new-question-button"
                        onClick={newQuestion}
                    >
                        New question
                    </button>
                    <button
                        type="button"
                        className="on-success-back-to-user-board"
                        onClick={() => history.push('/user')}
                    >
                        Back to user board
                    </button>

                    <div className="successfully-submitted-message">
                        Question successfully submitted!
                    </div>
                </>
            ) : (
                <>
                    <div className="submit-a-new-question-title">
                        Submit a new question
                    </div>
                    <label htmlFor="title" className="label-input-title">Title</label>
                    <input
                        type="text"
                        className="input-title"
                        id="title"
                        required
                        value={question.title}
                        onChange={handleInputChange}
                        name="title"
                    />
                    <label htmlFor="description" className="label-input-content">Your question</label>
                    <textarea
                        type="text"
                        className="input-content"
                        id="content"
                        required
                        value={question.content}
                        onChange={handleInputChange}
                        name="content"
                        rows={20}
                        cols={1}
                        Placeholder={"Your text here"}
                        maxLength={1000}
                    />

                    {selectedPaintingImage && (
                        <div className="painting-preview">
                            <img
                                className="image"
                                alt="image place holder"
                                src={preview}
                                //src={`http://localhost:8080/api/user/paintings/image/${paintingId}`}/*this works*/
                            />
                        </div>
                    )}
                    <button className="upload-painting-image-button" onClick={handleClick1}>
                        Upload painting image
                    </button>

                    <input type="file"
                           ref={hiddenFileInput1}
                           style={{display:'none'}}
                           name="image"
                           onChange={paintingImageSelectionHandler}
                        //onClick={alert('hello')}
                    />

                    <button className="upload-music-file-button" onClick={handleClick2}>
                        Upload music file
                    </button>

                    <input type="file"
                           ref={hiddenFileInput2}
                           style={{display:'none'}}
                           name="audio"
                           onChange={audiFileSelectionHandler}
                        //onClick={alert('hello')}
                    />

                    {selectedMusicFiles.length > 0 &&(
                        <div className="list-selected-music-files">
                            <p>Selected music files:</p>
                            {selectedMusicFiles.map((selectedFile) => {
                                return (
                                    <div key={`${selectedFile.name}`} className="selected-music-file-item">
                                        {selectedFile.name}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <button className="upload-supplementary-files-button" onClick={handleClick3}>
                        Upload supplementary files
                    </button>

                    {/*style={{display:'none'}} is added below based on a trick given in https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8*/}
                    <input type="file"
                           ref={hiddenFileInput3}
                           style={{display:'none'}}
                           name="files" multiple
                           onChange={fileSelectionHandler}
                    />


                    {selectedFiles.length > 0 &&(
                        <div className="list-supplementary-files">
                            <p>Attached files:</p>
                            {selectedFiles.map((selectedFile) => {
                                return (
                                    <div key={`${selectedFile.name}`} className="supplementary-file-item">
                                        {selectedFile.name}
                                    </div>
                                )
                            })}
                        </div>
                    )}



                    <button onClick={saveQuestion} className="submit-button">
                        Submit
                    </button>

                </>
            )}
        </div>
    );
};

export default AddQuestion;
