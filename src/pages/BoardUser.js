import React, {useState, useEffect, useContext} from "react";
import EventBus from "../common/EventBus";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";
import AuthService from "../services/auth.service";
import "../pages.styling/board-user-styling-grid.css";
import ProjectsListAsTiles from "../components/ProjectsListAsTiles";
import {AuthContext} from "../context/AuthoritiesContextProvider";
import Button from "../components/Button";
const currentUser = AuthService.getCurrentUser();
console.log('9 currentUser',currentUser);


const BoardUser = () => {
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const history = useHistory();

  const contextData = useContext(AuthContext);
  const {username, setUsername} = contextData;
  const {isModerator, setIsModerator} = contextData;
  const {isAdministrator, setIsAdministrator} = contextData;
  setUsername(currentUser.username)
  if (currentUser.roles.includes("ROLE_ADMIN")) {
    setIsAdministrator(true)
  }
  if (currentUser.roles.includes("ROLE_MODERATOR")) {
    setIsModerator(true)
  }

  const getFilesNames = (questionObject) => {
    if (questionObject.attachedFiles.size > 0) {
      const fileNames = questionObject.attachedFiles.map(attachedFileObject => {
        return questionObject.attachedFiles.name
      });
    }
  };

  const handleResponse = (QuestionObjectsArray) => {
    QuestionObjectsArray.map(questionObject => {
      const mappedArray = {};
      mappedArray.id = questionObject.questionId;
      mappedArray.title = questionObject.title;
      return mappedArray;//{id:questionObject.questionId,title:questionObject.title}

    });
  }

  /*const clickHandler = ()  => alert("Hello! ");*/
  const clickHandler = ()  => {history.push('/initiateProject')  };


  return (

        <div className="board-user-container-grid">

          <Button
              className={`btn-basic board-user-new-project-button`}
              disabled={false}
              /*clickHandler={clickHandler}*/
              clickHandler={()  => {history.push('/initiateProject')  }}
              label={`New Project`}
          />

          <div className="container-pages">
            <ProjectsListAsTiles/>
          </div>
        </div>
  )
}

export default BoardUser;
