import React, {useState, useEffect, useContext} from "react";
import UserService from "../services/user.access.service-DEPRECATED";
import EventBus from "../common/EventBus";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";
import AuthService from "../services/auth.service";
import "../components.styling/board-user-styling-grid.css";
import PaintingsListAsTilesWithPagination from "./PaintingsListAsTilesWithPagination";
import {AuthContext} from "../context/AuthoritiesContextProvider";
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
  console.log("33 currentUser.roles.includes(ROLE_ADMIN)", currentUser.roles.includes("ROLE_ADMIN"));
  console.log("34 isModerator", isModerator);
  console.log("35 isAdministrator", isAdministrator);


  const getFilesNames = (questionObject) => {
    if (questionObject.attachedFiles.size > 0) {
      const fileNames = questionObject.attachedFiles.map(attachedFileObject => {
        return questionObject.attachedFiles.name
      });
    }
  };

  const handleResponse = (QuestionObjectsArray) => {
    console.log('26 JSON.stringify(QuestionObjectsArray)', JSON.stringify(QuestionObjectsArray));
    QuestionObjectsArray.map(questionObject => {
      const mappedArray = {};
      mappedArray.id = questionObject.questionId;
      mappedArray.title = questionObject.title;
      console.log('32 mappedArray', mappedArray);
      return mappedArray;//{id:questionObject.questionId,title:questionObject.title}

    });


  }


  useEffect(() => {

    async function fetchData() {
      setError(false);
      toggleLoading(true);

      try {
        //const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`);
        const result = await axios.get('http://localhost:8080/api/user/questions-with-files-in-database', {
          headers: {
            'Authorization': `token ${currentUser.accessToken}`
          }
        });
        setQuestions(result.data);
        toggleLoading(false);
        console.log('27 result.data', result.data);

      } catch (error) {
        setError(true);
        toggleLoading(false);
      }

      if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
      }
    }

    //console.error('37 token', currentUser.accessToken);
    if (currentUser.accessToken) {
      fetchData();
      console.log('73 questions', questions);


    }

  }, []);


  return (
        <div className="board-user-container-grid">
          <button
              type="button"
              className="new-project-button"
              //disabled={isLoading}
              onClick={() => history.push('/initiateProject')}
          >
            New Project
          </button>
          {/*<button
              type="button"
              className="CSS-grid-test-1"
              //disabled={isLoading}
              onClick={() => history.push(`/CSSGridTest1`)}
          >
            CSS grid test 1
          </button>
          <button
              type="button"
              className="CSS-grid-test-2"
              //disabled={isLoading}
              onClick={() => history.push(`/CSSGridTest2`)}
          >
            CSS grid test 2
          </button>*/}
          <div className="container-pages">
            <PaintingsListAsTilesWithPagination/>
          </div>
        </div>
  )
}

export default BoardUser;
