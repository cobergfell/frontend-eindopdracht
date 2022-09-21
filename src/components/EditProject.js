import React, {useEffect, useState} from "react";
import {useHistory, useLocation, useParams} from "react-router-dom";
import AuthService from "../services/auth.service";
import "../components.styling/edit-project-styling-grid.css";
import FileService from "../services/file.service";
import AudioFileService from "../services/audioFile.service";
import PaintingService from "../services/painting.service";
import { faHome } from "@fortawesome/free-solid-svg-icons";
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

    const [myTest, setMyTest] = useState([]);
    const [preview, setPreview] = useState()
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedAudioFiles, setSelectedAudioFiles] = useState([]);
    const [currentFiles, setCurrentFiles] = useState([]);
    const [currentAudioFiles, setCurrentAudioFiles] = useState([]);
    const [currentFilesUrls, setCurrentFilesUrls] = useState([]);
    const [currentAudioFilesUrls, setCurrentAudioFilesUrls] = useState([]);
    const [filesToDeleteIds, setFilesToDeleteIds] = useState([]);
    const [audioFilesToDeleteIds, setAudioFilesToDeleteIds] = useState([]);

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const [image, setImage] = useState(null);
    const history = useHistory();
    const location = useLocation();
    const paintingId = location.state.paintingId;
    const description = location.state.description;
    const hiddenFileInput1 = React.useRef(null);
    const hiddenFileInput2 = React.useRef(null);
    const hiddenFileInput3 = React.useRef(null);

    console.log('49 painting',painting)
    console.log('50 selectedPaintingImage',selectedPaintingImage)
    console.log('51 selectedFiles',selectedFiles)
    console.log('52 currentAudioFilesUrls',currentAudioFilesUrls)
    console.log('53 selectedAudioFiles',selectedAudioFiles)
    console.log('54 currentFilesUrls',currentFilesUrls)
    console.log('55 myTest',myTest)
    console.log('56 filesToDeleteIds',filesToDeleteIds)
    console.log('57 audioFilesToDeleteIds',audioFilesToDeleteIds)



    const goBack = () => {
        history.goBack()
    }

    const deselectAudioFiles = (e) => {
        let updatedSelection=[];
        const checked = e.target.checked;
        selectedAudioFiles.forEach(file => {if (!checked){updatedSelection.push(file)}}
        );
        setSelectedAudioFiles(updatedSelection)
    };

    const deselectFiles = (e) => {
        let updatedSelection=[];
        const checked = e.target.checked;
        selectedFiles.forEach(file => {if (!checked){updatedSelection.push(file)}}
        );
        setSelectedFiles(updatedSelection)
    };


    const deselectAudioFiles_v2 = (e,selectedFileObject) => {
        let updatedSelection=[];
        //const name = e.target;
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
            console.log('61 checked')
            setFilesToDeleteIds(filesToDeleteIds => [...filesToDeleteIds, selectedFileObject["fileId"]])
        } else {
            //unchecked
            console.log('66 unchecked')
            setFilesToDeleteIds(filesToDeleteIds => filesToDeleteIds.filter(id=> id!=selectedFileObject["fileId"]))
        }
    };

    const selectAudioFilesToDelete = (e,selectedFileObject) => {
        const checked = e.target.checked;
        if (checked) {
            //checked
            console.log('61 checked')
            setAudioFilesToDeleteIds(audioFilesToDeleteIds => [...audioFilesToDeleteIds, selectedFileObject["fileId"]])
        } else {
            //unchecked
            console.log('66 unchecked')
            setAudioFilesToDeleteIds(audioFilesToDeleteIds => audioFilesToDeleteIds.filter(id=> id!=selectedFileObject["fileId"]))
        }
    };

    // the naive way to copy an object according to https://www.digitalocean.com/community/tutorials/copying-objects-in-javascript
    function copy(mainObj) {
        let objCopy = {}; // objCopy will store a copy of the mainObj
        let key;

        for (key in mainObj) {
            objCopy[key] = mainObj[key]; // copies each property to the objCopy object
        }
        return objCopy;
    }

    // or in arrow version
    const copyArrowVersion = (mainObj)  => {
        let objCopy = {}; // objCopy will store a copy of the mainObj
        let key;

        for (key in mainObj) {
            objCopy[key] = mainObj[key]; // copies each property to the objCopy object
        }
        return objCopy;


    }

    //a shallow copy version would be
    //let objCopy = Object.assign({}, obj);



    //begin of example from https://stackoverflow.com/questions/25046301/convert-url-to-file-or-blob-for-filereader-readasdataurl
    async function getFileFromUrlTest(url, name, defaultType = 'image/jpeg'){
        console.log('94 url',url)
        const response = await fetch(url);
        const data = await response.blob();
        console.log('97 data',data)
        setMyTest(myTest => [...myTest, new File([data],name,{type: data.type || defaultType})
        ])

        return new File([data], name, {
             type: data.type || defaultType,
         });
    }

    //function below was not working as expected, just given here as reference material
    async function getFileFromUrl(url, defaultName, defaultType = 'image/jpeg'){
        console.log('101 url',url)
        const response = await fetch(url);
        const data = await response.blob();
       // response.download("D:\\Users\\Gebruiker\\Downloads");
        setSelectedAudioFiles(selectedAudioFiles => [...selectedAudioFiles, new File([data],data.name|| defaultName,{type: data.type || defaultType})
         ])

        return new File([data], {
            type: data.type || defaultType,
            name:data.name || defaultName,
        });
    }


    //function below was not working as expected, just given here as reference material
    async function getFileFromUrlV2(){
        console.log('119 selectedAudioFileUrls',currentAudioFilesUrls)
        if (currentAudioFilesUrls!=[]){
            for (const selectedAudioFileUrl of currentAudioFilesUrls){
                const link = document.createElement('a');
                console.log('123 link',link)
                link.href = selectedAudioFileUrl;
                //link.download='bla';//this is just the hypertext
                //link.click();
                link.remove();
                setSelectedAudioFiles(selectedAudioFiles => [...selectedAudioFiles, link.click()
                ])
            }}
    }


    //function below was not working as expected, just given here as reference material
    async function getFileFromUrlV3(){
        console.log('119 selectedAudioFileUrls',currentAudioFilesUrls)
        if (currentAudioFilesUrls!=[]){
            for (const selectedAudioFileUrl of currentAudioFilesUrls){
                console.log('138 url',selectedAudioFileUrl)
                const response = await fetch(selectedAudioFileUrl);
                const data = await response.blob();
                // response.download("D:\\Users\\Gebruiker\\Downloads");
                setSelectedAudioFiles(selectedAudioFiles => [...selectedAudioFiles, new File([data],data.name,{type: data.type })
                ])
            }}
    }

    //function below was not working as expected, just given here as reference material
    async function getFileFromUrlV4(){
        //based on response 47 of https://stackoverflow.com/questions/25046301/convert-url-to-file-or-blob-for-filereader-readasdataurl
        console.log('119 selectedAudioFileUrls',currentAudioFilesUrls)
        if (currentAudioFilesUrls!=[]){
            for (const selectedAudioFileUrl of currentAudioFilesUrls){
                console.log('138 url',selectedAudioFileUrl)
                let response = await fetch(selectedAudioFileUrl);
                let data = await response.blob();
                let metadata = {
                    name:data.name,
                    type: data.type
                };
                let file = new File([data], data.name, metadata);
                setSelectedAudioFiles(selectedAudioFiles => [...selectedAudioFiles, file])
            }}
    }



// `await` can only be used in an async body, but showing it here for simplicity.
//    const file = await getFileFromUrl('https://example.com/image.jpg', 'example.jpg');


    //end of example from https://stackoverflow.com/questions/25046301/convert-url-to-file-or-blob-for-filereader-readasdataurl




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
        console.log('33 event.target',event.target)
        setPainting({ ...painting, [name]: value });
    };


// option 2 (works well)
    const getPainting = (id) => {
        PaintingService.get(id)
            .then((response) => {
                //setPainting( copy(response.data));
                setPainting( Object.assign({},  response.data));

                console.log('240 response.data',response.data)
                console.log('241 selectedPaintingImage',selectedPaintingImage)
                console.log('242 painting',painting)

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
            })
            .catch(e => {
                console.log('437 error',e);
            });
    };

    const getImage = (id) => {
        PaintingService.getImage(id)
            .then((response) => {
                setImage(response.data)
                //setSelectedPaintingImage(new Blob([response.data], {type : 'image/png'}));
                //setSelectedPaintingImage(new File([response.data], 'bla'));
                // let reader = new FileReader();
                // reader.onload = (e) => {
                //     setSelectedPaintingImage(e.target.result);
                //     //reader.readAsDataURL(e.target.files[0]);
                // };
                //console.log('278 response.data',response.data)
                //Object.keys(response.data).forEach((prop)=> console.log('279 response.data props',prop));

            })
            .catch(e => {
                console.log('457 error',e);
            });
    };



    const paintingImageSelectionHandler = (e) => {
        //alert('hello there!')
        console.log('61 e.target',e.target)
        setSelectedPaintingImage(e.target.files[0]);
        console.log('63 selectedPaintingImage',selectedPaintingImage)
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

    const updatePainting = () => {

        let formData = new FormData()
        formData.append('username', currentUser.username)
        formData.append('title', painting.title)
        formData.append('artist', painting.artist)
        formData.append('dateTimePosted', painting.dateTimePosted)
        formData.append('description', painting.description)

        if (selectedPaintingImage!=null){
            formData.append('image',selectedPaintingImage,selectedPaintingImage.name);
        }

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

        /*if (currentFiles!=[]){
            for (const currentFile of currentFiles){
                //first clean file name
                formData.append('files',currentFile["file"],currentFile["file"].name);
            }
        }*/


        /*if (currentAudioFiles!=[]){
            for (const currentAudioFile of currentAudioFiles){
                //first clean file name
                formData.append('audioFiles',currentAudioFile["file"],currentAudioFile["file"].name);
            }
        }*/


        let partial_url;
        let config;
        //const auth= authHeader().Authorization;
        //const paramsAsString = new URLSearchParams(data).toString();
        console.log('142 selectedFiles',selectedFiles)
        let headers= {}
        if ((selectedFiles.length>0)||(selectedPaintingImage!=null)||(selectedAudioFiles.length>0)){headers=
            {'Content-Type': 'multipart/form-data',
                //'enctype':"multipart/form-data"
            }
        } else{
            headers={'Content-Type': 'application/json',
                //'enctype':"multipart/form-data"
            }
        }


        partial_url=`user/paintings-update`//+ paramsAsString;
        config={
            headers: {'Content-Type': 'multipart/form-data',
                'enctype':"multipart/form-data"
            },

            //Authorization:auth
        }

        console.log('67 ,partial_url',partial_url)
        console.log('67 ,config',config)
        PaintingService.update(paintingId,formData,partial_url,config)
            .then((response) => {
                setPainting(response.data);
                /*                    setPainting({
                                        artist: response.data.artist,
                                        attachedFiles: response.data.attachedFiles,
                                        dateTimePosted: response.data.dateTimePosted,
                                        description: response.data.description,
                                        image: response.data.image,
                                        lastUpdate: response.data.lastUpdate,
                                        paintingId: response.data.paintingId,
                                        title: response.data.title,
                                        username: response.data.username,
                                    });*/
                setSubmitted(true);
                console.log('116 selectedFiles',selectedFiles)
                console.log('117 response.data',response.data)
            }).catch(e => {
            console.log(e);
        });


        if(selectedFiles.length>0){
            for (const selectedFile of selectedFiles){
                //first clean file name
                formData.append('files',selectedFile,selectedFile.name);
            }
        }

        deleteFiles()
        deleteAudioFiles()
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
        console.log('490 bla');
    }, [paintingId]);

    // useEffect(() => {
    //     PaintingService.fetchPainting({paintingId,setPainting,setAudioFiles,setError,toggleLoading});
    // }, [paintingId]);




    useEffect(() => {
        getImage(paintingId);
    }, [paintingId]);



    return (
        <div className="edit-container-grid">

            {submitted ? (
                <>
                    {/*<button
                        type="button"
                        className="on-success-new-project-button"
                        onClick={() => history.push('/initiateProject')}
                    >
                        New project
                    </button>*/}
                    {/*<button
                        type="button"
                        className="on-edit-success-back-to-user-board"
                        onClick={() => history.push(`/paintings/${paintingId}`)}
                    >
                        Back to project
                    </button>*/}

                    <button className="from-edit-back-button" onClick={goBack}>
                        Back
                    </button>

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
                        maxLength={1000}
                    />


                    <button className="upload-updated-painting-image-button" onClick={handleClick1}>
                        Upload painting image
                    </button>

                    <input type="file"
                           ref={hiddenFileInput1}
                           style={{display:'none'}}
                           name="image"
                           onChange={paintingImageSelectionHandler}
                        //onClick={alert('hello')}
                    />


                    {image && (      /*in fact, we could do it also without loading first the image*/
                        <>
                            <div className="current-painting-preview-label">
                                Current painting
                            </div>
                            <div className="current-painting-preview">
                                <img
                                    className="image"
                                    alt="image place holder"
                                    //src={preview}
                                    src={`http://localhost:8080/api/user/paintings/image/${paintingId}`}/*this works*/
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
                                    //src={`http://localhost:8080/api/user/paintings/image/${paintingId}`}/*this works*/
                                />
                            </div>
                        </>
                    )}


                    <button className="upload-updated-music-file-button" onClick={handleClick2}>
                        Upload music file
                    </button>

                    <input type="file"
                           ref={hiddenFileInput2}
                           style={{display:'none'}}
                           name="audio"
                           onChange={audioFileSelectionHandler}
                        //onClick={alert('hello')}
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
                                                    {/*<p>JSON.stringify(selectedFile):{JSON.stringify(selectedFile)}</p>*/}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox-files"
                                                    //id="checkbox-audio-files"
                                                    //checked={checked}
                                                    //onChange={() => toggleChecked(!checked)}
                                                    //onChange={() =>console.log('667 hello')}
                                                    //onChange={() =>console.log('667 selectedFileObject',selectedFileObject)}
                                                    //onChange={() => filesToDeleteIds => [...filesToDeleteIds, selectedFileObject["fileId"]]}
                                                    //onChange={() => setFilesToDeleteIds(filesToDeleteIds => [...filesToDeleteIds, selectedFileObject["fileId"]])}
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
                                                {/*<p>JSON.stringify(selectedFile):{JSON.stringify(selectedFile)}</p>*/}
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
                                        <div key={`${selectedFile.name}`} className="current-file-row-grid">
                                            <div className="files-list-element" >
                                                {selectedFile.name}
                                            </div>
                                            {/*<span className="deselect-file" onClick={(e) => {deselectAudioFiles_v2(e,selectedFile);}}>
                                                remove
                                            </span>*/}
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
                                                {/*<p>JSON.stringify(selectedFile):{JSON.stringify(selectedFile)}</p>*/}
                                            </div>

                                        </div>
                                    )
                                })}


                            </div>
                        </div>
                    )}


                    <button className="upload-updated-supplementary-files-button" onClick={handleClick3}>
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
                                                {/*<p>JSON.stringify(selectedFile):{JSON.stringify(selectedFile)}</p>*/}
                                            </div>
                                            {/*<input
                                                type="checkbox"
                                                className="checkbox-files"
                                                onClick={(e) => {
                                                    deselectFiles(e,selectedFile);}}
                                            />*/}
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


                    <button onClick={updatePainting} className="submit-updated-button">
                        Submit
                    </button>

                </>
            )}
        </div>
    );
};

export default EditProject;