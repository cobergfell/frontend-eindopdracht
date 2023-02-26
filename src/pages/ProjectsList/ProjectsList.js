import React, { useState, useEffect, useMemo, useRef } from "react";
import PaintingService from "../../services/painting.service";
import "./projectsList.css";
import {useHistory} from "react-router-dom";

const ProjectsList = () => {
    const [paintings, setPaintings] = useState([]);
    const paintingsRef = useRef();
    const history = useHistory();

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
        <main >

            <table className="display-paintings-list">
                <thead>
                <tr>
                    <th>PaintingId</th>
                    <th>UserId</th>
                    <th>Posted on (GMT)</th>
                    <th>Last updated on (GMT)</th>
                    <th>Action</th>
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


        </main>);


};

export default ProjectsList;