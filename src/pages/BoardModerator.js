import React from "react";
import {useHistory} from "react-router-dom";
import "../pages.styling/board-moderator-styling-grid.css";
import ProjectsList from "../components/ProjectsList";
import PaintingService from "../services/painting.service";
import Button from "../components/Button";

const BoardModerator = () => {
  const history = useHistory();

    const removeAllPaintings = () => {
        PaintingService.removeAll()
            .then((response) => {
                console.log('21 response.data',response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };


  return (
      <div className="board-moderator-container-grid">

          <div className="paintings-data-box">
              <ProjectsList/>
          </div>

          <Button
              className={`btn-basic board-moderator-home-button`}
              disabled={false}
              clickHandler={() => history.push('/home')}
              label={`Home`}
          />

          <Button
              className={`btn-basic board-moderator-remove-all-paintings-button`}
              disabled={false}
              clickHandler={removeAllPaintings}
              label={`Remove all paintings`}
          />



      </div>


  );
};

export default BoardModerator;
