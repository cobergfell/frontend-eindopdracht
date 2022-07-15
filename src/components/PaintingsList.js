import React, { useState, useEffect, useMemo, useRef } from "react";
import PaintingDataService from "../services/painting.service";
import { useTable } from "react-table";
import axios from "axios";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import {Link, useHistory} from "react-router-dom";
const currentUser = AuthService.getCurrentUser();


const PaintingsList = (props) => {
    const [paintings, setPaintings] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const paintingsRef = useRef();
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const history = useHistory();

    paintingsRef.current = paintings;

    useEffect(() => {
        retrievePaintings();
    }, []);

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

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

    const refreshList = () => {
        retrievePaintings();
    };

    const removeAllPaintings = () => {
        PaintingDataService.removeAll()
            .then((response) => {
                console.log(response.data);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByTitle = () => {
        PaintingDataService.findByTitle(searchTitle)
            .then((response) => {
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

    const deletePainting = (rowIndex) => {
        const id = paintingsRef.current[rowIndex].id;

        PaintingDataService.remove(id)
            .then((response) => {
                history.push("/paintings");

                let newPaintings = [...paintingsRef.current];
                newPaintings.splice(rowIndex, 1);

                setPaintings(newPaintings);
            })
            .catch((e) => {
                console.log(e);
            });
    };



    return (<div >

        <table>
            <thead>
                <tr>
                    <th>PaintingId</th>
                    <th>Sender</th>
                    <th>Posted on (GMT)</th>
                    <th>Action</th>
                    <th>bla</th>
                </tr>
            </thead>

            <tbody>


            {paintings.map((painting) => (
                <tr key={painting.paintingId}>
                    <td>{painting.paintingId}</td>
                    <td>{painting.username}</td>
                    <td>{painting.dateTimePosted}</td>
                    <td>
                        <div>
                              <span onClick={() => openPainting(painting.paintingId)}
                                    className="actions"
                              >
                                <i className="far fa-edit action mr-2">display</i>
                              </span>
                            <span onClick={() => deletePainting(painting.paintingId)}
                                  className="actions"
                            >
                                <i className="fas fa-trash action">delete</i>
                              </span>
                            <span
                                onClick={() => alert('Hello from line 120')}
                                className="actions"
                            >
                                Hello
                              </span>
                        </div>

                    </td>
                    <td>bla</td>
                </tr>
            ))}
            </tbody>
        </table>

        <button className="my-primary-button" onClick={removeAllPaintings}>
            Remove All
        </button>



        {props.isModerator && (
            <button className="my-primary-button" onClick={removeAllPaintings}>
                Moderator button Remove All
            </button>
        )}

    </div>);


};

export default PaintingsList;