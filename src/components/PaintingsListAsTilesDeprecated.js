import React, { useState, useEffect, useMemo, useRef } from "react";
import PaintingDataService from "../services/painting.service";
import { useTable } from "react-table";
import axios from "axios";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import {Link, NavLink,useHistory} from "react-router-dom";
const currentUser = AuthService.getCurrentUser();

const PaintingsList = (props) => {
    const [paintings, setPaintings] = useState([]);
    const [painting, setPainting] = useState(null);
    const [image, setImage] = useState(null);
    const [searchTitle, setSearchTitle] = useState("");
    const paintingsRef = useRef();
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const history = useHistory();

    paintingsRef.current = paintings;

    useEffect(() => {
        retrievePaintings();
    }, []);

    const retrievePaintings = () => {
        PaintingDataService.getAll()
            .then((response) => {
                console.log('34 response.data',response.data);
                setPaintings(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };




    const openPainting = (paintingId) => {
        console.log("007 paintingId",paintingId);
        let path= `/paintings/${paintingId}`/*+ paintingId.toString()*/
        console.log("008 path",path);
        history.push(path);
    };




    return (<div className="my-painting-tiles">

                {paintings.map((painting) => (
                    <div className="my-painting-tile">
                        <div className="image-container">
                            <img
                                className="image"
                                alt="blablablabla"
                                src={`http://localhost:8080/api/user/paintings/image/${painting.paintingId}`}/*this works*/
                            />
                        </div>
                        <ul className="my-list-group list-group-horizontal">
                            <li className="my-list-group-item"><strong>Painting Id: </strong>{`${painting.paintingId}`}</li>
                            <li className="my-list-group-item"><strong>Title: </strong>{painting.title}</li>
                            <li className="my-list-group-item"><strong>Artist: </strong>{painting.artist}</li>
                            <li className="my-list-group-item"><strong>Creation Year: </strong>{painting.creationYear}</li>
                            <li className="my-list-group-item">
                                <div className="link-to-description-container">
                                    <NavLink
                                        to={{
                                            pathname: `/description`,
                                            //search: attachedFile.fileId,
                                            //hash: "",
                                            state: { id:painting.paintingId,
                                                    description: painting.description
                                            }
                                        }}
                                        className="link-to-description"
                                        //style={{ textDecoration: 'none', color: 'deepskyblue'}}
                                    >
                                        Description
                                    </NavLink>
                                </div>
                            </li>
                            <li className="my-list-group-item">
                                <div className="link-to-description-container">
                                    <NavLink
                                        to={{
                                            pathname: `/edit/painting/${painting.paintingId}`,
                                            //search: attachedFile.fileId,
                                            //hash: "",
                                            state: { paintingId:painting.paintingId,
                                                    description: painting.description,
                                            }
                                        }}
                                        className="link-to-description"
                                        //style={{ textDecoration: 'none', color: 'deepskyblue'}}
                                    >
                                        Edit
                                    </NavLink>
                                </div>
                            </li>
                        </ul>



                    </div>
        ))}


        {props.isModerator && (
            <button className="my-primary-button" onClick={PaintingDataService.remove(painting.paintingId)}>
                Remove painting
            </button>
        )}

    </div>);


};

export default PaintingsList;