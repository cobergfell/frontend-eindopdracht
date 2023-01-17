import React, { useState, useEffect,useContext } from 'react';
import {Link, NavLink, useHistory, useParams} from 'react-router-dom';
import AuthService from "../services/auth.service";
import "../components.styling/renderPainting-styling.css";
import {AuthContext} from "../context/AuthoritiesContextProvider";
import FileService from "../services/file.service";
import PaintingService from "../services/painting.service";
import AudioFileService from "../services/audioFile.service";
const currentUser = AuthService.getCurrentUser();


function RenderPainting({ dataObject}) {
    const contextData= useContext(AuthContext);
    const history = useHistory();
    const currentUser = AuthService.getCurrentUser();
    const {isModerator}=contextData
    const [hasEditingPrivilege, setHasEditingPrivilege] = useState(false);


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
        if (((dataObject.username==currentUser.username)||(isModerator==true))){return true
        } else{return false}
    }


    const deletePainting = (id) => {
        PaintingService.get(id)
            .then((response) => {
                if (response.data.attachedFiles!=null){
                    response.data.attachedFiles.forEach(file => FileService.remove(file.id))
                }
                if (response.data.attachedMusicFiles!=null){
                    response.data.attachedMusicFiles.forEach(file => AudioFileService.remove(file.id))
                }
                PaintingService.remove(id)
            })

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
                        pathname: `/paintings/${dataObject.paintingId}`,
                        state: { paintingId:dataObject.paintingId,
                            description: dataObject.description,
                            hasEditingPrivilege:hasEditingPrivilege
                        }
                    }}
                >
                    <img
                        className="image"
                        alt="painting image"
                        src={`http://localhost:8080/paintings/${dataObject.paintingId}/image`}/*this works*/
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
                                  pathname: `/paintings/${dataObject.paintingId}`,
                                  state: { paintingId:dataObject.paintingId,
                                      description: dataObject.description,
                                      hasEditingPrivilege:hasEditingPrivilege
                                  }
                              }}
                        >
                            Go to project
                        </Link>


                    </li>

                    {hasEditingPrivilege==true &&  (
                        <li className="list-summarize-painting-data-item">
                            <Link className="link-to-description"
                                  to={{
                                      pathname: `/edit/painting/${dataObject.paintingId}`,
                                      state: { paintingId:dataObject.paintingId,
                                          description: dataObject.description,
                                      }
                                  }}
                                  className="link-to-description"
                            >
                                Go to edit
                            </Link>
                        </li>
                    )}


                    {isModerator==true &&  (
                        <li className="delete-painting-link">
                        <span onClick={() => deletePainting(dataObject.paintingId)} className="delete-painting-link">
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