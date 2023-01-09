import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {useHistory, useLocation, useParams} from "react-router-dom";
//import QuestionService from "../deprecated/question.service";
//import AnswerService from "../services/answer.service";
import ReactionService from "../services/reaction.service";
import "../components.styling/add-reaction-styling-grid.css";
import Button from "../components/Button";
import Form from "react-validation/build/form";

const currentUser = AuthService.getCurrentUser();

const AddReaction = () => {

    const initialPaintingState = {
        username: "",
        title: "",
        artist: "",
        dateTimePosted:0,
        description: "",
        files:[],
        //published: false

    };


    const initialReactionState = {
        username: "",
        title: "",
        content: "",
        tags: "",
        reactionRelatedTo:"painting",
        files:[],

    };
    const [reaction, setReaction] = useState(initialReactionState);
    const [message, setMessage] = useState("");
    const [isQuestion, setIsQuestion] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [selectedMusicFiles, setSelectedMusicFiles] = useState([]);
    const [preview, setPreview] = useState()
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();
    const hiddenFileInput1 = React.useRef(null);
    const hiddenFileInput2 = React.useRef(null);
    const hiddenFileInput3 = React.useRef(null);
    const { id } = useParams();
    const location = useLocation();
    const reactionType = location.state.reactionType;
    console.log("52 message",message)
    console.log("52 submitted",submitted)
    useEffect(() => {
        if(reactionType=='questions'){setIsQuestion(true)}
        else
            {setIsQuestion(false)}

    }, [])

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


    const handleInputChange = event => {
        const { name, value } = event.target;
        setReaction({ ...reaction, [name]: value });
    };

    const handleClick1 = event => {
        hiddenFileInput1.current.click();
    }
    const handleClick2 = event => {
        hiddenFileInput2.current.click();
    }
    const handleClick3 = event => {
        hiddenFileInput3.current.click();
    }

    const fileSelectionHandler = (e) => {
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
    };

    const paintingImageSelectionHandler = (e) => {
        setSelectedPaintingImage(e.target.files[0]);
        setPreview(e.target.files[0]);

    };

    const audiFileSelectionHandler = (e) => {
        setSelectedMusicFiles(selectedMusicFiles => [...selectedMusicFiles, e.target.files[0]]);
    };


    const saveReaction = () => {

        let formData = new FormData()

        if (reaction.title!=null){
            formData.append('title', reaction.title)
        }
        if (reaction.content!=null){
            formData.append('content', reaction.content)
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
        let partial_url=`/${reactionType}`;
        let config;
        if(selectedFiles.length==0){
            config={headers: {'Content-Type': 'application/json'},}
        } else {
            config={headers: {'Content-Type': 'multipart/form-data'},}
        }

        ReactionService.create(id,formData,partial_url,config)
            .then(response => {
                setReaction({
                    username: response.data.username,
                    title: response.data.title,
                    content: response.data.content,
                    reactionRelatedTo: response.data.reactionRelatedTo,
                    files: response.data.files,
                });
                setSubmitted(true);
            },
                (error) => {
                    //setMessage(JSON.stringify(error));
                    setMessage(error.message);
                }
            )
    };

    const newReaction = () => {
        setReaction(initialReactionState);
        setSubmitted(false);
    };

    return (
        <div className="send-reaction-container-grid">
            {submitted ? (
                <>
                    <Button
                        className={`btn-basic on-success-new-reaction-button`}
                        disabled={false}
                        clickHandler={newReaction}
                        label={`New Reaction`}
                    />
                    <Button
                        className={`btn-basic on-success-back-to-user-board-button`}
                        disabled={false}
                        clickHandler={() => history.push('/user')}
                        label={`Back to user board`}
                    />

                    <div className="successfully-submitted-message">
                       Reaction successfully submitted!
                    </div>
                </>
            ) : (
                <>
                    <div className="submit-a-new-reaction-title">
                        {reactionType=="questions" ? (`Submit a question`):("Submit an answer")}
                    </div>
                    <label htmlFor="title" className="label-input-title">Title</label>
                    <input
                        type="text"
                        className="input-title"
                        id="title"
                        required
                        value={reaction.title}
                        onChange={handleInputChange}
                        name="title"
                    />
                    <label htmlFor="description" className="label-input-content">Your reaction</label>
                    <textarea
                        type="text"
                        className="input-content"
                        id="content"
                        required
                        value={reaction.content}
                        onChange={handleInputChange}
                        name="content"
                        rows={20}
                        cols={1}
                        Placeholder={"Your text here"}
                        maxLength={100000}
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

                    <Button
                        className={`btn-basic add-reaction-upload-painting-image-button`}
                        disabled={false}
                        clickHandler={handleClick1}
                        label={`Upload painting image`}
                    />



                    <input type="file"
                           ref={hiddenFileInput1}
                           style={{display:'none'}}
                           name="image"
                           onChange={paintingImageSelectionHandler}
                        //onClick={alert('hello')}
                    />

                    <Button
                        className={`btn-basic add-reaction-upload-music-file-button`}
                        disabled={false}
                        clickHandler={handleClick2}
                        label={`Upload music file`}
                    />


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

                    <Button
                        className={`btn-basic add-reaction-upload-supplementary-files-button`}
                        disabled={false}
                        clickHandler={handleClick3}
                        label={`Upload supplementary files`}
                    />


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


                    <Button
                        className={`btn-basic add-reaction-submit-button`}
                        disabled={false}
                        clickHandler={saveReaction}
                        label={`Submit`}
                    />

                </>
            )}
            {message && (
                <div className={"error-message"}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AddReaction;
