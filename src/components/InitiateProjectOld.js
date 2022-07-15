import React, {useEffect, useState} from "react";
import PaintingDataService from "../services/painting.service";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {useHistory, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import "../components.styling/initiateProject-styling-old.css";
import "../components.styling/buttons-styling-deprecated.css";

const currentUser = AuthService.getCurrentUser();


const InitiateProjectOld = () => {

    const initialPaintingState = {
        username: "",
        title: "",
        artist: "",
        dateTimePosted:0,
        description: "",
        files:[],
        //published: false

    };
    const [painting, setPainting] = useState(initialPaintingState);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [selectedMusicFiles, setSelectedMusicFiles] = useState([]);
    const [preview, setPreview] = useState()
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();
    const hiddenFileInput1 = React.useRef(null);
    const hiddenFileInput2 = React.useRef(null);
    const hiddenFileInput3 = React.useRef(null);
    console.log('AddPaintingNotMaintainedAnymore line 27 painting',painting)
    console.log('AddPaintingNotMaintainedAnymore line 28 selectedPaintingImage',selectedPaintingImage)
    console.log('AddPaintingNotMaintainedAnymore line 29 selectedFiles',selectedFiles)
    console.log('AddPaintingNotMaintainedAnymore line 30 selectedMusicFiles',selectedMusicFiles)



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
        setPreview(e.target.files[0]);

    };

    const fileSelectionHandler = (e) => {
        //const fileName=cleanFileName(e.target.files[0].name)
        //console.log('56 fileName',fileName)

        console.log('67 e.target.files',e.target.files)
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
    };


    const audiFileSelectionHandler = (e) => {
        //const fileName=cleanFileName(e.target.files[0].name)
        //console.log('56 fileName',fileName)

        console.log('67 e.target.files',e.target.files)
        setSelectedMusicFiles(selectedMusicFiles => [...selectedMusicFiles, e.target.files[0]]);
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

        for (const selectedMusicFile of selectedMusicFiles){
            //first clean file name
            formData.append('musicFiles',selectedMusicFile,selectedMusicFile.name);
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
                        dateTimePosted:response.data.dateTimePosted,
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
    const handleClick3 = event => {
        hiddenFileInput3.current.click();
    }


    ////code below given as reference
    /*    const onChangeDoSomething = (e) => {
            const anotherState = e.target.value;
            setAnotherState(anotherState);
        };*/


    /*    async function fetchAnswers() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/?paintingId=${paintingId}`, {
                const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/${paintingId}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                setAnswers(result.data);
                console.log('67 result.data',result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
                console.log('142 e',e);
            }
        }*/

    /*    async function fetchImage() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&apppaintingId=${apiKey}&lang=nl`);
                const result = await axios.get(`http://localhost:8080/api/user/paintings/image?paintingId=${paintingId}`, {

                    headers: {
                        'Content-Type': 'image/jpeg',
                        //'Content-Type': 'multipart/form-data',
                        'Authorization': `token ${currentUser.accessToken}`
                    },

                });
                setImage(result.data);
                console.log('28 result.data',result.data);
                toggleLoading(false);

                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
            }
        }*/

    /*async function fetchPainting() {
        setError(false);
        toggleLoading(true);
        try {
            //const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`);
            //const result= await axios.get(`http://localhost:8080/api/user/paintings?paintingId=${paintingId}`, {
            const result= await axios.get(`http://localhost:8080/api/user/paintings/${paintingId}`, {
                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });
            //setPainting(Object.assign({}, fetchedPainting));//shallow copy
            //setPainting(JSON.parse(JSON.stringify(result.data[0])));//deep copy
            setPainting(result.data);
            console.log('74 ${paintingId}',`${paintingId}`);
            console.log('75 result.data',result.data);
            toggleLoading(false);

        } catch (e) {
            setError(true);
            toggleLoading(false);
        }
    }*/

    /*    async function fetchQuestions() {
            setError(false);
            toggleLoading(true);
            try {
                //const result = await axios.get(`http://localhost:8080/api/user/answers-by-paintingId/?paintingId=${paintingId}`, {
                const result = await axios.get(`http://localhost:8080/api/user/questions-by-paintingId/${paintingId}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                setQuestions(result.data);
                console.log('67 result.data',result.data);
                toggleLoading(false);

            } catch (e) {
                setError(true);
                toggleLoading(false);
                console.log('72 e',e);
            }
        }*/





    //debut de travaux
    //https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
    /*    async function myFetch() {
            let response = await axios.get(`http://localhost:8080/api/user/questions-by-paintingId/${paintingId}`, {
                headers: {
                    'Authorization': `token ${currentUser.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else{setQuestions(response.data);}
            const questionsIdList=[]
            let myListOfIds = await response.data.map((question) => { questionsIdList.push(question.questionId) })
            for (let id of questionsIdList) {
                let response = await axios.get(`http://localhost:8080/api/user/answers-by-questionId/${id}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else{setAnswers(response.data);}
            }
        }*/

    // useEffect(()=>{
    //
    //     if (currentUser.accessToken) {
    //         fetchAnswers();
    //         console.log('78 answers',answers);
    //     }
    //
    // },[]);

    // useEffect(()=>{
    //     if (currentUser.accessToken) {
    //         fetchImage();
    //         console.log('44 image',image);
    //     }
    // },[]);

    // useEffect(()=>{
    //     if (currentUser.accessToken) {
    //         fetchPainting();
    //         console.log('50 painting',painting);
    //     }
    // },[]);

    // useEffect(()=>{
    //     if (currentUser.accessToken) {
    //         fetchQuestions();
    //         console.log('118 questions',questions);
    //     }
    // },[]);


    // useEffect(() => {
    //     myFetch() .catch(e => {
    //         console.log('There has been a problem with your fetch operation: ' + e.message);
    //     });
    // }, []);


    ////end of code given as reference

    return (
        <div className="initiateProject-component-container">
            <div className="initiateProject-form-title">
                Initiate a new project - Submit a new painting
            </div>


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
                <>

                    <div className="initiateProject-form-group-of-rows">

                        <div className="initiateProject-form-row">
                            <div className="initiateProject-form-input-elements">
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
                            <div className="initiateProject-form-input-elements">
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
                        <div className="initiateProject-form-row">
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
                                    rows={20}
                                    cols={1}
                                    Placeholder={"Your text here"}
                                    MaxLength={1000}


                                />
                            </div>
                        </div>


                        <div className="initiateProject-form-row">
                            <div className="initiate-project-form-buttons">
                                <li className="my-button-wrapper">
                                    <Button className="my-primary-button" onClick={handleClick1}>
                                        Upload painting image
                                    </Button>

                                    <input type="file"
                                           ref={hiddenFileInput1}
                                           style={{display:'none'}}
                                           name="image"
                                           onChange={paintingImageSelectionHandler}
                                        //onClick={alert('hello')}
                                    />


                                </li>
                                {/*style={{display:'none'}} is added below based on a trick given in https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8*/}


                                    {selectedPaintingImage && (
                                        <li className="my-button-wrapper">
                                            <img
                                                className="image"
                                                alt="image place holder"
                                                src={preview}
                                                //src={`http://localhost:8080/api/user/paintings/image/${paintingId}`}/*this works*/
                                            />
                                        </li>
                                    )}

                                <li className="my-button-wrapper">
                                    <Button className="my-primary-button" onClick={handleClick2}>
                                        Upload music file
                                    </Button>

                                    <input type="file"
                                           ref={hiddenFileInput2}
                                           style={{display:'none'}}
                                           name="audio"
                                           onChange={audiFileSelectionHandler}
                                        //onClick={alert('hello')}
                                    />


                                </li>
                                {/*style={{display:'none'}} is added below based on a trick given in https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8*/}


                                {selectedMusicFiles.length > 0 &&(
                                    <>
                                        <li className="my-button-wrapper">
                                            <div className="preview-container">
                                                <p>Selected music files:</p>
                                                {selectedMusicFiles.map((selectedFile) => {
                                                    return (
                                                        <li key={`${selectedFile.name}`}>
                                                            {selectedFile.name}
                                                        </li>
                                                    )
                                                })}
                                            </div>
                                        </li>
                                    </>
                                )}



                                <li className="my-button-wrapper">
                                    <Button className="my-primary-button" onClick={handleClick3}>
                                        Upload supplementary files
                                    </Button>
                                </li>
                                {/*style={{display:'none'}} is added below based on a trick given in https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8*/}
                                <input type="file"
                                       ref={hiddenFileInput3}
                                       style={{display:'none'}}
                                       name="files" multiple
                                       onChange={fileSelectionHandler}
                                />





                                        {selectedFiles.length > 0 &&(
                                            <>
                                            <li className="my-button-wrapper">
                                                <div className="preview-container">
                                                <p>Attached files:</p>
                                                    {selectedFiles.map((selectedFile) => {
                                                        return (
                                                            <li key={`${selectedFile.name}`}>
                                                                {selectedFile.name}
                                                            </li>
                                                        )
                                                    })}
                                                </div>
                                            </li>
                                            </>
                                        )}

                                    <li className="my-button-wrapper">
                                        <button onClick={savePainting} className="my-primary-button">
                                            Submit
                                        </button>
                                    </li>
                                </div>


                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InitiateProjectOld;