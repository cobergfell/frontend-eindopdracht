import React from "react";
import {useHistory} from "react-router-dom";
import "./board-moderator.css";
import ProjectsList from "../ProjectsList/ProjectsList";
import PaintingService from "../../services/painting.service";
import Button from "../../components/Button/Button";

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
      <main className="board-moderator-container-grid">

          <section className="paintings-data-box">
              <ProjectsList/>
          </section>

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
              label={`Remove all`}
          />


      </main>


  );
};

export default BoardModerator;
