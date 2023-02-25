import React, { useState, useEffect, useRef} from "react";
import PaintingDataService from "../../services/painting.service";
import Pagination from "../../components/Pagination/Pagination";
import RenderPainting from "../../components/RenderPainting/RenderPainting";
import "../../components/RenderPainting/renderPainting.css";


const ProjectsListAsTiles = () => {
    const [paintings, setPaintings] = useState([]);
    const paintingsRef = useRef();

    paintingsRef.current = paintings;

    useEffect(() => {
        retrievePaintings();
    }, []);

    const retrievePaintings = () => {
        PaintingDataService.getAll()
            .then((response) => {
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
                        dataLimit={5}
                    />
                </>
            ) : (
                <div className="no-post-to-display">No Post to display</div>
            )}
        </>
    );


};

export default ProjectsListAsTiles;