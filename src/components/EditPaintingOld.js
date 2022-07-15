import React, {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import FileService from "../services/file.service";
import PaintingService from "../services/painting.service";
import QuestionService from "../services/question.service";
import axios from 'axios';


const currentUser = AuthService.getCurrentUser();

const EditPaintingOld = () => {

    const initialPaintingState = {
        artist: "",
        attachedFiles: [],
        dateTimePosted: "2022-01-06 15:30:54",
        description: "",
        image: null,
        lastUpdate: "2022-01-06 15:30:54",
        paintingId: 0,
        title: "",
        username: "",
    };


    //const [painting, setPainting] = useState(initialPaintingState);
    const [painting, setPainting] = useState(null);
    const [currentPaintingImage, setCurrentPaintingImage] = useState(null);
    const [selectedPaintingImage, setSelectedPaintingImage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [currentFiles, setCurrentFiles] = useState([]);
    const [addedFiles, setAddedFiles] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const paintingId = location.state.paintingId;
    const description = location.state.description;
    console.log('34 painting',painting)
    console.log('35 selectedFiles',selectedFiles)
    console.log('36 currentFiles',currentFiles)
    console.log('37 selectedPaintingImage',selectedPaintingImage)

    const hiddenFileInput1 = React.useRef(null);
    const hiddenFileInput2 = React.useRef(null);
    const hiddenFileInput3 = React.useRef(null);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setPainting({ ...painting, [name]: value });
        console.log('AddPaintingNotMaintainedAnymore line 25 painting',painting)
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

    const fileSelectionHandler = (e) => {
        //const fileName=cleanFileName(e.target.files[0].name)
        //console.log('56 fileName',fileName)
        setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);
        //setAddedFiles(addedFiles => [...addedFiles, e.target.files[0]]);
    };


    const paintingImageSelectionHandler = (e) => {
        //const fileName=cleanFileName(e.target.files[0].name)
        //console.log('56 fileName',fileName)
        setSelectedPaintingImage(e.target.files[0]);
        // if(e.target.files!=null){
        //     console.log('86 e.target.files',e.target.files)
        //     setSelectedPaintingImage(e.target.files[0]);
        // } else {
        //     setSelectedPaintingImage(painting.image);
        //     console.log('90 SelectedPaintingImage',selectedPaintingImage)
        // }

    };

    /*    const fileSelectionInitial = (painting) => {
            if (painting!=null)
            {
                painting.attachedFiles.map((attachedFile) => (setSelectedFiles(selectedFiles => [...selectedFiles, attachedFile])))
            }
        };*/


    /*    const openFile = (id) => {
            let path= "/files/" + id.toString()
            history.push(path);
        };*/

    const deleteFile = (id) => {
        FileService.remove(id)
            .then((response)=>{
                let newCurrentFiles = [...currentFiles];
                currentFiles.forEach(file => {if (file.id!=id){newCurrentFiles.push(file)}}
                );
                let newSelectedFiles = [...selectedFiles];
                selectedFiles.forEach(file => {if (file.id!=id){newSelectedFiles.push(file)}}
                );
                setSelectedFiles(newSelectedFiles)
                setCurrentFiles(newCurrentFiles)
                history.push("/paintingsAsTiles");
            })
            .catch((e) => {
                console.log(e);
            });
    };




    const updatePainting = () => {

        let formData = new FormData()
        formData.append('username', currentUser.username)
        formData.append('title', painting.title)
        formData.append('artist', painting.artist)
        formData.append('dateTimePosted', painting.dateTimePosted)
        formData.append('description', painting.description)

        //formData.append('files', selectedFiles[0],selectedFiles[0].name)
        // for (const selectedFile of selectedFiles){
        //     //first clean file name
        //     formData.append('files',selectedFile,selectedFile.name);
        // }

        let partial_url;
        let config;
        //const auth= authHeader().Authorization;
        //const paramsAsString = new URLSearchParams(data).toString();
        console.log('142 selectedFiles',selectedFiles)
        let headers= {}
        if ((selectedFiles.length>0)||(selectedPaintingImage!=null)){headers=
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

        if(selectedPaintingImage!=null){
            formData.append('files',selectedPaintingImage,selectedPaintingImage.name);
        }

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

// option 1 (works well)
    /*    async function getPainting(id) {
            try {
                const result = await axios.get(`http://localhost:8080/api/user/paintings/${paintingId}`, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    }
                });
                setPainting(result.data);
                console.log('199 result.data',result.data);

            } catch (e) {
                console.log('72 e',e);
            }
        }*/

// option 2 (works well)
    const getPainting = (id) => {
        PaintingService.get(id)
            .then((response) => {
                setPainting(response.data);
                // setPainting({...painting,
                //     artist: response.data.artist,
                //     attachedFiles: response.data.attachedFiles,
                //     dateTimePosted: response.data.dateTimePosted,
                //     description: response.data.description,
                //     image: response.data.image,
                //     lastUpdate: response.data.lastUpdate,
                //     paintingId: response.data.paintingId,
                //     title: response.data.title,
                //     username: response.data.username,
                // });

                //setSelectedPaintingImage(new File([response.data.image], response.data.name,{}));
                //setSelectedPaintingImage(selectedPaintingImage => [...selectedPaintingImage, new File([response.data.image], response.data.name,{name:response.data.name})]);
                //setCurrentPaintingImage(new File([response.data.image],response.data.name,{}))// this does not work, whyWhy do I have to use a list of Files even if I have only one?
                //setSelectedPaintingImage(selectedPaintingImage => [...selectedPaintingImage, new Blob([response.data.image], {type : 'image/png'})]);
                //setSelectedPaintingImage(new Blob([response.data.image], {type : 'image/png', name: 'hello'}));
                //setSelectedPaintingImage(response.data.image.blob());//blob(0 is not a functiom


                console.log('240 response.data',response.data)
                console.log('241 selectedPaintingImage',selectedPaintingImage)
                console.log('242 painting',painting)

                //response.data.attachedFiles.map((attachedFile) => (setSelectedFiles(selectedFiles => [...selectedFiles, attachedFile.data,attachedFile.name])))


                /*                response.data.attachedFiles.map((attachedFile) => (
                                setCurrentFiles(currentFiles => [...currentFiles, new File([attachedFile.data], attachedFile.name,
                                    {
                                        id:attachedFile.id,
                                        url:attachedFile.url,
                                        type: attachedFile.type,
                                        lastModified: attachedFile.lastModified

                                    }*/

                response.data.attachedFiles.map((attachedFile) => (
                    setCurrentFiles(currentFiles => [...currentFiles, attachedFile
                    ])))
                //setSelectedPaintingImage(response.data.image)


            })

            //example from https://stackoverflow.com/questions/8390855/how-to-instantiate-a-file-object-in-javascript var f = new File([""], "filename.txt", {type: "text/plain", lastModified: date})

            .catch(e => {
                console.log('137 error',e);
            });
    };

    const getImage = (id) => {
        PaintingService.getImage(id)
            .then((response) => {
                //setSelectedPaintingImage(new Blob([response.data], {type : 'image/png'}));
                //setSelectedPaintingImage(new File([response.data], 'bla'));
                // let reader = new FileReader();
                // reader.onload = (e) => {
                //     setSelectedPaintingImage(e.target.result);
                //     //reader.readAsDataURL(e.target.files[0]);
                // };

                console.log('278 response.data',response.data)
                //Object.keys(response.data).forEach((prop)=> console.log('279 response.data props',prop));


            })
            .catch(e => {
                console.log('281 error',e);
            });
    };


    useEffect(() => {
        getPainting(paintingId);
        console.log('243 bla');
    }, [paintingId]);


    useEffect(() => {
        getImage(paintingId);
    }, [paintingId]);

    useEffect(() => {
        updatePainting(paintingId);
        console.log('243 bla');
    }, [paintingId]);

    // useEffect(()=>{
    //     async function fetchImage() {
    //         try {
    //             //const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`);
    //             const result = await axios.get(`http://localhost:8080/api/user/paintings/image/1`, {
    //                 headers: {
    //                     'Authorization': `token ${currentUser.accessToken}`
    //                 }
    //             });
    //             //setQuestion(Object.assign({}, fetchedQuestion));//shallow copy
    //             //setQuestion(JSON.parse(JSON.stringify(result.data[0])));//deep copy
    //             setSelectedPaintingImage(new Blob([result.data], {type : 'image/png'}));
    //             console.log('319 result.data[0]',result.data);
    //
    //         } catch (e) {console.log('321 e',e);
    //
    //         }
    //     }
    //     if (currentUser.accessToken) {
    //         fetchImage();
    //     }
    //
    // },[]);




    /*   useEffect(() => {
            if(painting){fileSelectionInitial(painting);}
        }, [painting]);*/




    return (<>
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
                    painting && (
                        <div>
                            <div className="form-title">
                                Edit a painting
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
                                            //value='bla'
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
                                                    Choose a new painting image
                                                </Button>
                                            </li>
                                            {/*style={{display:'none'}} is added below based on a trick given in https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8*/}
                                            <input type="file"
                                                   ref={hiddenFileInput1}
                                                   style={{display:'none'}}
                                                   name="image"
                                                   onChange={paintingImageSelectionHandler}
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
                                            <button onClick={updatePainting} className="my-primary-button">
                                                Submit
                                            </button>
                                        </li>
                                    </div>
                                </div>
                                <p>Attached files:</p>
                                <table className="display-attached-files" >
                                    <thead>
                                    <tr>
                                        <th className="display-attached-files" >Id</th>
                                        <th className="display-attached-files">Name</th>
                                        <th className="display-attached-files" >Action</th>
                                        <th className="display-attached-files">JSON.stringify(file)</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {currentFiles.map((file) => (
                                        <tr key={file.id}>
                                            <td className="display-attached-files">{file.id}</td>
                                            <td className="display-attached-files">{file.name}</td>
                                            <td className="display-attached-files">
                                                <div>
                                              <span className="actions">
                                                <i className="far fa-edit action mr-2">
                                                  <Link className="display-action"
                                                        to={{
                                                            pathname: `/files/${file.id}`,
                                                            //hash: "",
                                                            state: { fileName: file.name }
                                                        }}
                                                      //style={{color: 'deepskyblue'}}
                                                  >
                                                display {/*{file.name}*/}
                                                </Link>
                                              </i>


                                                </span>

                                                    <span onClick={() => deleteFile(file.id)}
                                                          className="actions">
                                                    <i className="fas fa-trash action">delete</i>
                                                </span>
                                                    {/*                                                <span
                                                    onClick={() => alert('Hello from line 120')}
                                                    className="actions">
                                                Hello
                                                </span>*/}
                                                </div>

                                            </td>
                                            <td className="display-attached-files" >{JSON.stringify({file})}</td>

                                        </tr>
                                    ))}

                                    </tbody>
                                </table>

                            </div>

                        </div>

                    )

                )}
            </div>

        </>

    );
};

export default EditPaintingOld;

