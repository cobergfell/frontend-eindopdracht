import React, {useEffect, useState} from "react";
import PaintingDataService from "../services/painting.service";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {NavLink, useHistory, useParams} from "react-router-dom";
import "../pages.styling/initiate-project-styling-grid.css";
import Button from "../components/Button";

const currentUser = AuthService.getCurrentUser();


const InitiateProject = () => {

    const initialPaintingState = {
        username: "",
        title: "",
        artist: "",
        description: "",
        files:[],
        audioFiles:[],

    };

    const [painting, setPainting] = useState(initialPaintingState);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [selectedAudioFiles, setSelectedAudioFiles] = useState([]);
    const [preview, setPreview] = useState()
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
    const [missingInput, setMissingInput ]= useState(false);
    const [retry, setRetry ]= useState(false);
    const history = useHistory();
    const hiddenFileInput1 = React.useRef(null);
    const hiddenFileInput2 = React.useRef(null);
    const hiddenFileInput3 = React.useRef(null);

    console.log('37 missingInput',missingInput)
    console.log('37 retry',retry)

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

    const checkSending = () => {
        let missingData = false
        if (!painting.title){missingData=true}
        if (!painting.artist){missingData=true}
        if (!painting.description){missingData=true}
        if (!selectedPaintingImage){missingData=true}
        return missingData
    }


    const toggleRetry = () => setRetry(value => !value);

    const handleInputChange = event => {
        const { name, value } = event.target;
        console.log('33 event.target',event.target)
        setPainting({ ...painting, [name]: value });
    };



    const cleanFileName = (fileName)  => {
        console.log('37 fileName',fileName)
        let newFileName = "";
        let forbiddenCharacters = " ,"

        for (let i = 0; i < fileName.length; i++) {
            let char = fileName[i];

            for (let j = 0; j < forbiddenCharacters.length; j++) {
                if (char == forbiddenCharacters.charAt(j)) {
                    char = "_";
                }
            }
            newFileName = +char;
        }
        return newFileName
    }

    const paintingImageSelectionHandler = (e) => {
        //alert('hello there!')
        console.log('85 e.target',e.target)
        setSelectedPaintingImage(e.target.files[0]);
        console.log('87 selectedPaintingImage',selectedPaintingImage)
        setPreview(e.target.files[0]);

    };

    const fileSelectionHandler = (e) => {
        //const fileName=cleanFileName(e.target.files[0].name)
        //console.log('56 fileName',fileName)

        console.log('67 e.target.files',e.target.files)
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
    };


    const audioFileSelectionHandler = (e) => {
        //const fileName=cleanFileName(e.target.files[0].name)
        //console.log('56 fileName',fileName)

        console.log('67 e.target.files',e.target.files)
        setSelectedAudioFiles(selectedAudioFiles => [...selectedAudioFiles, e.target.files[0]]);
    };



    const handleRetry = () => {
        setRetry(value => false)
        setMissingInput(value => false)

    }

    const savePainting = () => {
        let missingData=checkSending()

        if (missingData===false){
            setMissingInput(value => false)
            setRetry(value => false)
            console.log('135 bla')
            let formData = new FormData()
            formData.append('title', painting.title)
            formData.append('artist', painting.artist)
            formData.append('description', painting.description)
            formData.append('image',selectedPaintingImage,selectedPaintingImage.name);
            //formData.append('files', selectedFiles[0],selectedFiles[0].name)
            for (const selectedFile of selectedFiles){
                //first clean file name
                formData.append('files',selectedFile,selectedFile.name);
            }

            for (const selectedAudioFile of selectedAudioFiles){
                //first clean file name
                formData.append('audioFiles',selectedAudioFile,selectedAudioFile.name);
            }


            formData.append('username', currentUser.username)

            let partial_url=`user/paintings-upload`//+ paramsAsString;
            let config;
            //const auth= authHeader().Authorization;
            //const paramsAsString = new URLSearchParams(data).toString();
            console.log('49 selectedFiles',selectedFiles)
            if(selectedFiles.length>0){
                config={
                    headers: {'Content-Type': 'multipart/form-data'},
                    //Authorization:auth
                }

            } else{
                config={
                    headers: {'Content-Type': 'multipart/form-data'},
                }
            }
            console.log('67 ,partial_url',partial_url)
            console.log('67 ,config',config)
            PaintingDataService.create(formData,partial_url,config)
                .then(response => {
                    setPainting({
                        username: response.data.username,
                        title: response.data.title,
                        artist: response.data.artist,
                        dateTimePosted:response.data.dateTimePosted,
                        description: response.data.description,
                        image: response.data.image,
                        files: response.data.files,
                        audioFiles: response.data.audioFiles,

                    });
                    setSubmitted(true);
                    console.log('174 response',response)
                    console.log(response.data);
                }).catch(e => {
                console.log('177 e',e);
            });

        }

        else

        {   console.log('196 bla');
            setRetry(value => true)
        }

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

    // useEffect(() => {
    //     checkSending(painting)
    // }, [submitButtonClicked])//

    return (
        <div className="initiate-project-container-grid">

            {submitted ? (
                <>
                    <Button
                        className={`btn-basic initial-project-on-success-new-project-button`}
                        disabled={false}
                        clickHandler={() => history.push('/initiateProject')}
                        label={`New project`}
                    />
                    <Button
                        className={`btn-basic initial-project-on-success-back-to-user-board`}
                        disabled={false}
                        clickHandler={() => history.push('/user')}
                        label={`Back to user board`}
                    />

                    <div className="successfully-submitted-message">
                        Project successfully submitted!
                    </div>

                </>
            ) : (

                <>

                    <label htmlFor="title" className="label-input-title">Title</label>
                    <input
                        type="text"
                        className="input-title"
                        id="title"
                        required
                        value={painting.title}
                        onChange={handleInputChange}
                        name="title"
                    />
                    <label htmlFor="artist" className="label-input-artist">Artist</label>
                    <input
                        type="text"
                        className="input-artist"
                        id="artist"
                        //required
                        value={painting.artist}
                        onChange={handleInputChange}
                        name="artist"
                    />


                    <label htmlFor="description" className="label-input-description">Description</label>
                    <textarea
                        type="text"
                        className="input-description"
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
                        className={`btn-basic initial-project-upload-painting-image-button`}
                        disabled={false}
                        clickHandler={handleClick1}
                        label={`Upload painting image`}
                    />

                    <input type="file"
                           accept="image/png, image/jpeg"
                           ref={hiddenFileInput1}
                           style={{display:'none'}}
                           name="image"
                           onChange={paintingImageSelectionHandler}
                        //onClick={alert('hello')}
                    />

                    <Button
                        className={`btn-basic initial-project-upload-music-file-button`}
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
                        //onClick={alert('hello')}
                    />

                    {selectedAudioFiles.length > 0 &&(
                        <div className="list-selected-music-files">
                            <p>Selected music files:</p>
                            {selectedAudioFiles.map((selectedFile) => {
                                return (
                                    <div key={`${selectedFile.name}`} className="selected-music-file-item">
                                        {selectedFile.name}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <Button
                        className={`btn-basic initial-project-upload-supplementary-files-button`}
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
                        className={`btn-basic submit-initial-project-button`}
                        disabled={false}
                        clickHandler={savePainting}
                        label={`Submit`}
                    />

                </>

            )}
            {retry &&(
                <>
                    <div  className="missingInput-message">
                        Failed sending data: enter at least, title, artist name, description and select an image
                    </div>

                    <Button
                        className={`btn-basic initiate-project-retry-button`}
                        disabled={false}
                        clickHandler={handleRetry}
                        label={`Retry`}
                    />


                </>
            )}
        </div>
    );


};

export default InitiateProject;