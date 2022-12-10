import React, { useState, useEffect, useMemo, useRef } from "react";
import PaintingService from "../services/painting.service";
import "../components.styling/projectsList-styling-grid.css";
import AuthService from "../services/auth.service";
import {Link, useHistory, useLocation} from "react-router-dom";
const currentUser = AuthService.getCurrentUser();

const ProjectsList = (props) => {
    const [paintings, setPaintings] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const paintingsRef = useRef();
    const history = useHistory();
    const location = useLocation();

    paintingsRef.current = paintings;

    useEffect(() => {
        retrievePaintings();
    }, []);

    const retrievePaintings = () => {
        PaintingService.getAll()
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

    const findByTitle = () => {
        PaintingService.findByTitle(searchTitle)
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

    const deletePainting = (paintingId) => {
        PaintingService.remove(paintingId)
            .then(response => {
                console.log(response.data);
                history.push("/moderator");
            })
            .catch(e => {
                console.log(e);
            });
    };



    return (
        <div >

            <table className="display-paintings-list">
                <thead>
                <tr>
                    <th>PaintingId</th>
                    {/*<th style={{width: '250px'}}>Email</th>*/}
                    <th>UserId</th>
                    <th>Posted on (GMT)</th>
                    <th>Last updated on (GMT)</th>
                    <th>Action</th>
                    {/*<th>JSON.stringify(user)</th>*/}
                </tr>
                </thead>

                <tbody>

                {paintings.map((painting) => (
                    <tr key={painting.paintingId}>
                        <td>{painting.paintingId}</td>
                        <td>{painting.username}</td>
                        <td>{painting.dateTimePosted}</td>
                        <td>{painting.lastUpdate}</td>

                        <td>
                            <div>
                              <span
                                  className="actions"
                                  onClick={() => history.push({pathname: `/edit/painting/${painting.paintingId}`,
                                      search: '',
                                      hash: '',
                                      state: { paintingId: painting.paintingId,
                                          description: painting.description,
                                      },
                                      key: ''
                                  },)}



                              >
                                <i className="far fa-edit action mr-2">edit/</i>
                              </span>
                                <span onClick={() => deletePainting(painting.paintingId)}
                                      className="actions"
                                >
                                <i className="fas fa-trash action">delete</i>
                              </span>
                            </div>

                        </td>

                    </tr>
                ))}

                </tbody>
            </table>


        </div>);


};

export default ProjectsList;