import React, {useEffect, useState} from "react";
import {useHistory, useLocation, useParams} from "react-router-dom";
import AuthService from "../../services/auth.service";
import "./edit-project.css";
import Button from "../../components/Button/Button";
import FileService from "../../services/file.service";
import AudioFileService from "../../services/audioFile.service";
import PaintingService from "../../services/painting.service";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const currentUser = AuthService.getCurrentUser();


const EditProject = () => {

    const initialPaintingState = {
        username: "",
        title: "",
        artist: "",
        description: "",
        files:[],
        musicFiles:[],
    };

    const [painting, setPainting] = useState(initialPaintingState);
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState()
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [currentPaintingImage, setCurrentPaintingImage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedAudioFiles, setSelectedAudioFiles] = useState([]);
    const [currentFiles, setCurrentFiles] = useState([]);
    const [currentAudioFiles, setCurrentAudioFiles] = useState([]);
    const [currentFilesUrls, setCurrentFilesUrls] = useState([]);
    const [currentAudioFilesUrls, setCurrentAudioFilesUrls] = useState([]);
    const [filesToDeleteIds, setFilesToDeleteIds] = useState([]);
    const [audioFilesToDeleteIds, setAudioFilesToDeleteIds] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
    const [missingInput, setMissingInput ]= useState(false);
    const [retry, setRetry ]= useState(false);
    const [image, setImage] = useState(null);
    const history = useHistory();
    const location = useLocation();
    const paintingId = location.state.paintingId;
    //const description = location.state.description;
    const hiddenFileInput1 = React.useRef(null);
    const hiddenFileInput2 = React.useRef(null);
    const hiddenFileInput3 = React.useRef(null);

    const goBack = () => {
        history.goBack()
    }

    const checkSending = (painting) => {
        setMissingInput(value => false)
        if (painting.title==null){setMissingInput(true)}
        if (painting.artist==null){setMissingInput(true)}
        if (painting.description==null){setMissingInput(true)}
    }

    const toggleRetry = () => setRetry(value => !value);

    const handleRetry = () => {
        toggleRetry()
        setMissingInput(value => false)
    }



    const deselectAudioFiles_v2 = (e,selectedFileObject) => {
        let updatedSelection=[];
        const name = selectedFileObject.name;
        selectedAudioFiles.forEach(file => {if (file.name!=name){updatedSelection.push(selectedFileObject)}}
        );
        setSelectedAudioFiles(updatedSelection)
    };

    const deselectFiles_v2 = (e) => {
        let updatedSelection=[];
        const checked = e.target;
        selectedFiles.forEach(file => {if (!checked){updatedSelection.push(file)}}
        );
        setSelectedFiles(updatedSelection)
    };


    const selectFilesToDelete = (e,selectedFileObject) => {
        const checked = e.target.checked;
        if (checked) {
            //checked
            setFilesToDeleteIds(filesToDeleteIds => [...filesToDeleteIds, selectedFileObject["fileId"]])
        } else {
            //unchecked
            setFilesToDeleteIds(filesToDeleteIds => filesToDeleteIds.filter(id=> id!=selectedFileObject["fileId"]))
        }
    };

    const selectAudioFilesToDelete = (e,selectedFileObject) => {
        const checked = e.target.checked;
        if (checked) {
            //checked
            setAudioFilesToDeleteIds(audioFilesToDeleteIds => [...audioFilesToDeleteIds, selectedFileObject["fileId"]])
        } else {
            //unchecked
            setAudioFilesToDeleteIds(audioFilesToDeleteIds => audioFilesToDeleteIds.filter(id=> id!=selectedFileObject["fileId"]))
        }
    };

    const deleteFile = (id) => {
        FileService.remove(id)
            .then((response)=>{
                let newCurrentFiles = [];
                currentFiles.forEach(file => {if (file.id!=id){newCurrentFiles.push(file)}}
                );
                setCurrentFiles(newCurrentFiles)
                history.push("/user");
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const deleteAudioFile = (id) => {
        AudioFileService.remove(id)
            .then((response)=>{
                let newCurrentAudioFiles = [];
                currentAudioFiles.forEach(file => {if (file.id!=id){newCurrentAudioFiles.push(file)}}
                );
                setCurrentAudioFiles(newCurrentAudioFiles)
                history.push("/user");
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const deleteFiles = () => {
        filesToDeleteIds.forEach(id=>{deleteFile(id)})};

    const deleteAudioFiles = () => {
        audioFilesToDeleteIds.forEach(id=>{deleteAudioFile(id)})};

    const handleInputChange = event => {
        const { name, value } = event.target;
        setPainting({ ...painting, [name]: value });
    };


    const getPainting = (id) => {
        PaintingService.get(id)
            .then((response) => {
                setPainting( Object.assign({},  response.data));
                response.data.attachedFiles.map((attachedFile) => (
                    setCurrentFilesUrls(currentFilesUrls => [...currentFilesUrls, attachedFile.fileOnDiskUrl])))

                response.data.attachedMusicFiles.map((attachedMusicFile) => (
                    setCurrentAudioFilesUrls(currentAudioFilesUrls => [...currentAudioFilesUrls, attachedMusicFile.fileOnDiskUrl])))


                response.data.attachedFiles.map((attachedFile) => (
                    setCurrentFiles(currentFiles => [...currentFiles,
                        {
                            "fileId":attachedFile.id,
                            "file": new File([attachedFile.data], attachedFile.name, {
                                name: attachedFile.name,
                                type: attachedFile.type
                            })
                        }] // so currentAudioFile is a list of objects with to keys "fileId" and "file" of the form {"fileId": ..., "file"...}

                    )))

                response.data.attachedMusicFiles.map((attachedMusicFile) => (
                    setCurrentAudioFiles(currentAudioFiles => [...currentAudioFiles,
                        {
                            "fileId":attachedMusicFile.id,
                            "file": new File([attachedMusicFile.data], attachedMusicFile.name, {
                                name: attachedMusicFile.name,
                                type: attachedMusicFile.type
                            })
                        }] // so currentAudioFile is a list of objects with two keys "fileId" and "file" of the form {"fileId": ..., "file"...}
                    )))

                setCurrentPaintingImage(response.data.image);
            })
            .catch(e => {
                console.log('e',e);
            });
    };

    const getImage = (id) => {
        PaintingService.getImage(id)
            .then((response) => {
                setImage(response.data)
            })
            .catch(e => {
                console.log('error',e);
            });
    };

    const paintingImageSelectionHandler = (e) => {
        setSelectedPaintingImage(e.target.files[0]);
        setPreview(e.target.files[0]);
    };

    const fileSelectionHandler = (e) => {
        console.log('e.target.files',e.target.files)
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
    };


    const audioFileSelectionHandler = (e) => {
        setSelectedAudioFiles(selectedAudioFiles => [...selectedAudioFiles, e.target.files[0]]);
    };

    const updatePainting = () => {
        console.log('222')
        toggleRetry()
        setSubmitButtonClicked(true)
        if (missingInput==false){
            console.log('226')

            let formData = new FormData()
            formData.append('username', currentUser.username)
            formData.append('title', painting.title)
            formData.append('artist', painting.artist)
            formData.append('dateTimePosted', painting.dateTimePosted)
            formData.append('description', painting.description)

            if (selectedPaintingImage!=null){
                console.log('236')
                formData.append('image',selectedPaintingImage,selectedPaintingImage.name);
            }
            // else{
            //     console.log('240')
            //     formData.append('image',currentPaintingImage);
            //     console.log('241')
            //     //formData.append('image',currentPaintingImage,painting.title);
            //     console.log('242')
            // }
            console.log('244')

            if (selectedFiles!=[]){
                for (const selectedFile of selectedFiles){
                    //first clean file name
                    formData.append('files',selectedFile,selectedFile.name);
                }
            }

            if (selectedAudioFiles!=[]){
                for (const selectedAudioFile of selectedAudioFiles){
                    //first clean file name
                    formData.append('audioFiles',selectedAudioFile,selectedAudioFile.name);
                }
            }

            let partial_url;
            let config;
            let headers= {}
            if ((selectedFiles.length>0)||(selectedPaintingImage!=null)||(selectedAudioFiles.length>0)){headers=
                {'Content-Type': 'multipart/form-data',
                }
            } else{
                headers={'Content-Type': 'application/json',
                }
            }


            partial_url=`/paintings`
            config={
                headers: {'Content-Type': 'multipart/form-data',
                    'enctype':"multipart/form-data"
                },
            }

            PaintingService.update(paintingId,formData,partial_url,config)
                .then((response) => {
                    setPainting(response.data);
                    setSubmitted(true);
                } ,(error) => {
                    setMessage(error.response.data);
                });

            if(selectedFiles.length>0){
                for (const selectedFile of selectedFiles){
                    //first clean file name
                    formData.append('files',selectedFile,selectedFile.name);
                }
            }

            deleteFiles()
            deleteAudioFiles()
        }
    };

    const newPainting = () => {
        setPainting(null);
        setSubmitted(false);
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


    //from https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
    // create a preview as a side effect, whenever selected file is changed
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


    useEffect(() => {
        getPainting(paintingId);
    }, [paintingId]);


    useEffect(() => {
        getImage(paintingId);
    }, [paintingId]);

    useEffect(() => {
        checkSending(painting)
    }, [submitButtonClicked])


    return (
        <div className="edit-container-grid">

            {submitted ? (
                <>
                    <Button
                        className={`btn-basic from-edit-back-button`}
                        disabled={false}
                        clickHandler={goBack}
                        label={`Back`}
                    />

                    <div className="successfully-submitted-message">
                        Project successfully updated!
                    </div>
                </>
            ) : (
                <>
                    <div className="edit-project-form-title">
                        Edit project initial data
                    </div>

                    <label htmlFor="title" className="label-input-updated-title">Title</label>
                    <input
                        type="text"
                        className="input-updated-title"
                        id="title"
                        required
                        value={painting.title}
                        onChange={handleInputChange}
                        name="title"
                    />
                    <label htmlFor="artist" className="label-input-updated-artist">Artist</label>
                    <input
                        type="text"
                        className="input-updated-artist"
                        id="artist"
                        //required
                        value={painting.artist}
                        onChange={handleInputChange}
                        name="artist"
                    />

                    <label htmlFor="description" className="label-input-updated-description">Description</label>
                    <textarea
                        type="text"
                        className="input-updated-description"
                        id="description"
                        required
                        value={painting.description}
                        onChange={handleInputChange}
                        name="description"
                        rows={20}
                        cols={1}
                        Placeholder={"Your text here"}
                        maxLength={100000}
                    />

                    <Button
                        className={`btn-basic upload-updated-painting-image-button`}
                        disabled={false}
                        clickHandler={handleClick1}
                        label={`Upload image`}
                    />



                    <input type="file"
                           accept="image/png, image/jpeg"
                           ref={hiddenFileInput1}
                           style={{display:'none'}}
                           name="image"
                           onChange={paintingImageSelectionHandler}
                    />


                    {image && (
                        <>
                            <div className="current-painting-preview-label">
                                Current painting
                            </div>
                            <div className="current-painting-preview">
                                <img
                                    className="image"
                                    alt="image place holder"
                                    //src={preview}
                                    src={`http://localhost:8080/paintings/${paintingId}/image`}/*this works*/
                                />
                            </div>
                        </>
                    )}

                    {selectedPaintingImage && (
                        <>
                            <div className="new-painting-preview-label">
                                New painting
                            </div>
                            <div className="new-painting-preview">
                                <img
                                    className="image"
                                    alt="image place holder"
                                    src={preview}
                                    //src={`http://localhost:8080/api/user/paintings/image/${paintingId}`}/*this would work*/
                                />
                            </div>
                        </>
                    )}

                    <Button
                        className={`btn-basic upload-updated-music-file-button`}
                        disabled={false}
                        clickHandler={handleClick2}
                        label={`Upload music file`}
                    />

                    <input type="file"
                           accept="audio/mpeg"
                           ref={hiddenFileInput2}
                           style={{display:'none'}}
                           name="audio"
                           onChange={audioFileSelectionHandler}
                    />

                    {currentAudioFiles.length > 0 &&(
                        <div className="list-current-audio-files-container-grid">
                            <div className="current-files-box-title" >
                                Current audio files:
                            </div>
                            <div className="current-files-box-header-column-1" >
                                File name:
                            </div>
                            <div className="current-files-box-header-column-2" >
                                Remove
                            </div>
                            <div className="list-current-files-flex-container" >
                                {currentAudioFiles.map((currentFileObject) => {
                                    return (
                                        <div key={`${currentFileObject["file"].name}`} className="current-file-row-grid">
                                            <div className="files-list-element" >
                                                {currentFileObject["file"].name}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="checkbox-files"
                                                onClick={(e) => {
                                                    selectAudioFilesToDelete(e,currentFileObject);}}
                                            />
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                    )}



                    <input type="file"
                           ref={hiddenFileInput3}
                           style={{display:'none'}}
                           name="files" multiple
                           onChange={fileSelectionHandler}
                    />


                    {currentFiles.length > 0 &&(
                        <div className="list-current-files-container-grid">
                            <div className="current-files-box-title" >
                                Current files:
                            </div>
                            <div className="current-files-box-header-column-1" >
                                File name:
                            </div>
                            <div className="current-files-box-header-column-2" >
                                Remove
                            </div>
                            <div className="list-current-files-flex-container" >
                                {currentFiles.map((currentFileObject) => {
                                    return (
                                        <div key={`${currentFileObject["file"].name}`} className="current-file-row-grid">
                                            <div className="files-list-element" >
                                                {currentFileObject["file"].name}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="checkbox-files"
                                                onClick={(e) => {
                                                    selectFilesToDelete(e,currentFileObject);}}
                                            />

                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                    )}

                    {selectedAudioFiles.length > 0 &&(
                        <div className="list-selected-audio-files-container-grid">
                            <div className="current-files-box-title" >
                                Selected additional audio files:
                            </div>
                            <div className="current-files-box-header-column-1" >
                                File name:
                            </div>
                            <div className="list-current-files-flex-container" >
                                {selectedAudioFiles.map((selectedFile) => {
                                    return (
                                        <div key={`${selectedFile.name}`} className="current-file-row-grid" >
                                            <div className="files-list-element" >
                                                {selectedFile.name}
                                            </div>
                                            <div className="deselect-file" onClick={(e) => {deselectAudioFiles_v2(e,selectedFile);}}>
                                                <FontAwesomeIcon icon={faTrash} />
                                                <span>remove</span>
                                            </div>


                                        </div>
                                    )
                                })}


                            </div>
                        </div>
                    )}


                    {selectedFiles.length > 0 &&(
                        <div className="list-selected-files-container-grid">
                            <div className="current-files-box-title" >
                                Selected additional files:
                            </div>
                            <div className="current-files-box-header-column-1" >
                                File name:
                            </div>
                            <div className="list-current-files-flex-container" >
                                {selectedFiles.map((selectedFile) => {
                                    return (
                                        <div key={`${selectedFile.name}`} className="current-file-row-grid">
                                            <div className="files-list-element" >
                                                {selectedFile.name}
                                            </div>

                                        </div>
                                    )
                                })}


                            </div>
                        </div>
                    )}


                    <Button
                        className={`btn-basic upload-updated-supplementary-files-button`}
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
                        <div className="list-selected-files-container-grid">
                            <div className="current-files-box-title" >
                                Selected additional files:
                            </div>
                            <div className="current-files-box-header-column-1" >
                                File name:
                            </div>

                            <div className="list-current-files-flex-container" >
                                {selectedFiles.map((selectedFile) => {
                                    return (
                                        <div key={`${selectedFile.name}`} className="current-file-row-grid">
                                            <div className="files-list-element" >
                                                {selectedFile.name}
                                            </div>
                                            <div className="deselect-file" onClick={(e) => {deselectFiles_v2(e,selectedFile);}}>
                                                <FontAwesomeIcon icon={faTrash} />
                                                <span>remove</span>
                                            </div>

                                        </div>

                                    )
                                })}

                            </div>
                        </div>
                    )}

                    <Button
                        className={`btn-basic submit-update-button`}
                        disabled={false}
                        clickHandler={updatePainting}
                        label={`Submit`}
                    />

                </>
            )}


            {missingInput && submitButtonClicked &&(
                <>
                    <div  className="edit-project-missingInput-message">
                        Failed sending data: enter at least, title, artist name, description and select an image
                    </div>

                    <Button
                        className={`btn-basic edit-project-retry-button`}
                        disabled={false}
                        clickHandler={handleRetry}
                        label={`Retry`}
                    />
                </>
            )}

            {message && (
                <div className={"edit-project-error-message"}>
                    {message}
                </div>
            )}

        </div>

    );
};

export default EditProject;