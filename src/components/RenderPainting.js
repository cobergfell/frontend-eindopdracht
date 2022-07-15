import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, NavLink, useHistory, useParams} from 'react-router-dom';
import {sortDataBy} from "../services/utilities";
//import { AuthContext } from '../context/AuthContext';
import DownloadFile from "./DownloadFile";
import AuthService from "../services/auth.service";
import "../components.styling/renderPainting-styling.css";
import {AuthContext} from "../context/AuthoritiesContextProvider";
import FileService from "../services/file.service";
import PaintingService from "../services/painting.service";
import AudioFileService from "../services/audioFile.service";
const currentUser = AuthService.getCurrentUser();


function RenderPainting({ dataObject}) {
    const contextData= useContext(AuthContext);
    //const {username, isModerator} = contextData;
    const history = useHistory();
    const currentUser = AuthService.getCurrentUser();
    const {isModerator}=contextData
    const [hasEditingPrivilege, setHasEditingPrivilege] = useState(false);
    //const [audioFilesToDeleteIds, setAudioFilesToDeleteIds] = useState([]);


    //if (currentUser.roles.includes("ROLE_MODERATOR")){setIsModerator(true)}
    // console.log("25 dataObject",dataObject);
    console.log("Line 23 of RenderPainting: isModerator",isModerator);
    console.log("Line 24 of RenderPainting: contextData",contextData);
    // console.log("27 JSON.stringify(currentUser)",JSON.stringify(currentUser));


    const deletePaintingDeprecated = (id) => {
        PaintingService.remove(id)
            .then((response) => {
                history.push("/user");
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const modificationPrivilege = (dataObject) => {
        if (((dataObject.username==currentUser)||(isModerator==true))){return true
        } else{return false}
    }


    const deletePainting = (id) => {
        PaintingService.get(id)
            .then((response) => {
                console.log('47 response.data', response.data)
                //response.data.attachedFiles.map((attachedFile) => (
                //    setFilesToDeleteIds(filesToDeleteIds => [...filesToDeleteIds, attachedFile.id])))

                //response.data.attachedMusicFiles.map((attachedMusicFile) => (
                //    setAudioFilesToDeleteIds(audioFilesToDeleteIds => [...audioFilesToDeleteIds, attachedAudioFile.id])))
                if (response.data.attachedFiles!=null){
                    response.data.attachedFiles.forEach(file => FileService.remove(file.id))
                }
                if (response.data.attachedMusicFiles!=null){
                    response.data.attachedMusicFiles.forEach(file => AudioFileService.remove(file.id))
                }
                PaintingService.remove(id)

            })
            //.then(PaintingService.get(id))
            //.then(PaintingService.remove(id))
            .then((response) => {
                history.push("/user");
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        setHasEditingPrivilege(modificationPrivilege(dataObject));
    }, []);


    return (
        <div className="painting-tile-grid">
            <div className="painting-tile-grid-image-container">
                <Link
                      to={{
                          //pathname: `/description`,
                          pathname: `/paintings/${dataObject.paintingId}`,
                          //search: attachedFile.fileId,
                          //hash: "",
                          state: { paintingId:dataObject.paintingId,
                              description: dataObject.description,
                              hasEditingPrivilege:hasEditingPrivilege
                          }
                      }}
                    //style={{ textDecoration: 'none', color: 'deepskyblue'}}
                >
                    <img
                        className="image"
                        alt="painting image"
                        src={`http://localhost:8080/api/user/paintings/image/${dataObject.paintingId}`}/*this works*/
                    />
                </Link>
            </div>

            <div className="painting-tile-grid-metadata-container">
                <ul className="list-summarize-painting-data">
                    <li className="list-summarize-painting-data-item"><strong>Painting Id: </strong>{`${dataObject.paintingId}`}</li>
                    <li className="list-summarize-painting-data-item"><strong>Send by: </strong>{dataObject.username}</li>
                    <li className="list-summarize-painting-data-item"><strong>Sending date: </strong>{dataObject.dateTimePosted}</li>
                    <li className="list-summarize-painting-data-item"><strong>Last update: </strong>{dataObject.lastUpdate}</li>
                    <li className="list-summarize-painting-data-item"><strong>Title: </strong>{dataObject.title}</li>
                    <li className="list-summarize-painting-data-item"><strong>Artist: </strong>{dataObject.artist}</li>
                    <li className="list-summarize-painting-data-item">
                        <Link className="link-to-description"
                            to={{
                                //pathname: `/description`,
                                pathname: `/paintings/${dataObject.paintingId}`,
                                //search: attachedFile.fileId,
                                //hash: "",
                                state: { paintingId:dataObject.paintingId,
                                    description: dataObject.description
                                }
                            }}
                            //style={{ textDecoration: 'none', color: 'deepskyblue'}}
                        >
                            Go to project
                        </Link>


                    </li>

                    {hasEditingPrivilege==true &&  (
                        <li className="list-summarize-painting-data-item">
                            <Link className="link-to-description"
                                  to={{
                                      pathname: `/edit/painting/${dataObject.paintingId}`,
                                      //search: attachedFile.fileId,
                                      //hash: "",
                                      state: { paintingId:dataObject.paintingId,
                                          description: dataObject.description,
                                      }
                                  }}
                                  className="link-to-description"
                                //style={{ textDecoration: 'none', color: 'deepskyblue'}}
                            >
                                Go to edit
                            </Link>
                        </li>


                    )}


                    {isModerator==true &&  (
                    <li className="delete-painting-link">
                        <span onClick={() => deletePainting(dataObject.paintingId)} className="delete-painting-link">
                            {/*<i className="fas fa-trash action">delete</i>*/}
                            Delete
                        </span>
                    </li>
                    )}

                </ul>
            </div>
        </div>


    );

}

export default RenderPainting;