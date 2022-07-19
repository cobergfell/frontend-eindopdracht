import React, { useState, useEffect } from "react";
import {Link, useHistory} from "react-router-dom";
import "../components.styling/board-moderator-styling-grid.css";
import UserService from "../services/user.access.service-DEPRECATED";
import EventBus from "../common/EventBus";
import QuestionsList from "./QuestionsList";
import AuthService from "../services/auth.service";
import PaintingsListAsTilesWithPagination from "./PaintingsListAsTilesWithPagination";
import PaintingsList from "./PaintingsList";
import UsersList from "./UsersList";
import PaintingService from "../services/painting.service";

const BoardModerator = () => {
  const [content, setContent] = useState("");
  const currentUser = AuthService.getCurrentUser();
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

/*  useEffect(() => {
    UserService.getModeratorBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);*/

  return (
      <div className="board-moderator-container-grid">

          <div className="paintings-data-box">
              <PaintingsList/>
          </div>
          <button
              className="home-button"
              //disabled={isLoading}
              onClick={() => history.push('/home')}
          >
              Home
          </button>
          <button
              className="remove-all-paintings-button"
              onClick={removeAllPaintings}
          >
              Remove All
          </button>


      </div>


  );
};

export default BoardModerator;
