import React, { useState, useEffect, useRef} from "react";
import {useHistory} from "react-router-dom";
import PaintingDataService from "../services/painting.service";
import AuthService from "../services/auth.service";
import Pagination from "./Pagination";
import RenderPainting from "./RenderPainting";
import "../components.styling/painting-list-as-tiles-styling-grid.css";

const PaintingsListAsTilesWithPagination = (props) => {
    const [paintings, setPaintings] = useState([]);
    const [painting, setPainting] = useState(null);
    const [image, setImage] = useState(null);
    const [searchTitle, setSearchTitle] = useState("");
    const paintingsRef = useRef();
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const history = useHistory();
    const currentUser = AuthService.getCurrentUser();

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

    return (
        <>

            {paintings.length > 0 ? (
                <>
                    <Pagination
                        data={paintings}
                        RenderComponent={RenderPainting}
                        title="Painting music library"
                        pageLimit={3}
                        dataLimit={4}
                    />
                </>
            ) : (
                <div className="no-post-to-display">No Post to display</div>
            )}
        </>
    );


};

export default PaintingsListAsTilesWithPagination;