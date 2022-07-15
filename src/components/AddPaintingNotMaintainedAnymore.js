import React, { useState } from "react";
import PaintingDataService from "../services/painting.service";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {useHistory, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
const currentUser = AuthService.getCurrentUser();

const AddPaintingNotMaintainedAnymore = () => {

    const initialPaintingState = {
        username: "",
        title: "",
        artist: "",
        creationYear:0,
        description: "",
        files:[],
        //published: false

    };
    const [painting, setPainting] = useState(initialPaintingState);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();
    const hiddenFileInput1 = React.useRef(null);
    const hiddenFileInput2 = React.useRef(null);
    console.log('AddPaintingNotMaintainedAnymore line 27 painting',painting)
    console.log('AddPaintingNotMaintainedAnymore line 28 selectedPaintingImage',selectedPaintingImage)


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
        console.log('61 e.target',e.target)
        setSelectedPaintingImage(e.target.files[0]);
        console.log('63 selectedPaintingImage',selectedPaintingImage)
    };

    const fileSelectionHandler = (e) => {
        //const fileName=cleanFileName(e.target.files[0].name)
        //console.log('56 fileName',fileName)

        console.log('67 e.target.files',e.target.files)
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
    };



    const savePainting = () => {

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

        formData.append('username', currentUser.username)

        let partial_url;
        let config;
        //const auth= authHeader().Authorization;
        //const paramsAsString = new URLSearchParams(data).toString();
        console.log('49 selectedFiles',selectedFiles)
        if(selectedFiles.length>0){
            console.log('67 bla 67')
            partial_url=`user/paintings-upload`//+ paramsAsString;
            config={
                headers: {'Content-Type': 'multipart/form-data'},
                //Authorization:auth
            }

            console.log('67 ,partial_url',partial_url)
            console.log('67 ,config',config)
            PaintingDataService.create(formData,partial_url,config)
                .then(response => {
                    setPainting({
                        username: response.data.username,
                        title: response.data.title,
                        artist: response.data.artist,
                        creationYear:response.data.creationYear,
                        description: response.data.description,
                        image: response.data.image,
                        files: response.data.files,

                    });
                    setSubmitted(true);
                    console.log('57 response',response)
                    console.log(response.data);
                }).catch(e => {
                console.log(e);
            });

        } else{alert('hello there, this is computer talking to you, and I say: you forgot to attach a painting!')}

    };

    const newPainting = () => {
        setPainting(initialPaintingState);
        setSubmitted(false);
    };

    const handleClick1 = event => {
        hiddenFileInput1.current.click();
    }
    const handleClick2 = event => {
        hiddenFileInput2.current.click();
    }
    return (
        <div className="my-submit-form">
            {submitted ? (
                <>
                    {/*<div className="d-flex align-items-end justify-content-end">*/}
                    <div>
                        <div>
                            {/*                           <button className="btn btn-success" onClick={newAnswer}>
                                Add new answer
                            </button>*/}
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={newPainting}
                            >
                                New painting
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => history.push("/PaintingsList")}
                            >
                                Painting list
                            </button>
                        </div>
                    </div>
                    <div className="add some styling here">
                        <p>Painting successfully submitted!</p>
                    </div>

                </>
            ) : (
                <div>
                    <div className="form-title">
                        Submit a new painting
                    </div>

                    <div className="my-form-group-of-rows">
                        <div className="my-form-row">
                            <div className="my-form-input-elements">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    className="my-form-control"
                                    id="title"
                                    required
                                    value={painting.title}
                                    onChange={handleInputChange}
                                    name="title"
                                />
                            </div>
                            <div className="my-form-input-elements">
                                <label htmlFor="artist">Artist</label>
                                <input
                                    type="text"
                                    className="my-form-control"
                                    id="artist"
                                    //required
                                    value={painting.artist}
                                    onChange={handleInputChange}
                                    name="artist"

                                />
                            </div>



                        </div>



                        <div className="my-form-row">
                            <div className="my-form-input-elements">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    type="text"
                                    className="my-form-control"
                                    id="description"
                                    required
                                    value={painting.description}
                                    onChange={handleInputChange}
                                    name="description"

                                />
                            </div>
                        </div>

                        <div className="my-form-row">
                            <div className="send-form-buttons">
                                <div>
                                    <li className="my-button-wrapper">
                                        <Button className="my-primary-button" onClick={handleClick1}>
                                            Choose painting image
                                        </Button>
                                    </li>
                                    {/*style={{display:'none'}} is added below based on a trick given in https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8*/}
                                    <input type="file"
                                           ref={hiddenFileInput1}
                                           style={{display:'none'}}
                                           name="image"
                                           onChange={paintingImageSelectionHandler}
                                           //onClick={alert('hello')}
                                    />
                                </div>


                                <div>
                                    <li className="my-button-wrapper">
                                        <Button className="my-primary-button" onClick={handleClick2}>
                                            Choose files
                                        </Button>
                                    </li>
                                    {/*style={{display:'none'}} is added below based on a trick given in https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8*/}
                                    <input type="file"
                                           ref={hiddenFileInput2}
                                           style={{display:'none'}}
                                           name="files" multiple
                                           onChange={fileSelectionHandler}
                                    />
                                </div>
                                <li className="my-button-wrapper">
                                    <button onClick={savePainting} className="my-primary-button">
                                        Submit
                                    </button>
                                </li>
                            </div>
                        </div>
                        <div className="my-form-row">
                            <div className="select-painting-image">
                                {selectedPaintingImage && (
                                `Select painting image:${selectedPaintingImage.name}`
                                )}
                            </div>
                        </div>
                        <div className="my-form-row">
                            <div className="attached-files-list">

                                <p>Attached files:</p>
                                    <ul>
                                        {selectedFiles.map((selectedFile) => {
                                            return (
                                                <li key={`${selectedFile.name}`}>
                                                    {selectedFile.name}
                                                </li>
                                            )
                                        })}
                                    </ul>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default AddPaintingNotMaintainedAnymore;