import React, { useState, useEffect } from "react";

import UserService from "../services/user.access.service";
import EventBus from "../common/EventBus";
import QuestionsList from "./QuestionsList";
import AuthService from "../services/auth.service";

const BoardModerator = () => {
  const [content, setContent] = useState("");
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
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
  }, []);

  return (
/*    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>*/
      <>
      <div className="container">
        <header className="header-admin-board">
          <h3>
            <strong>{currentUser.username}</strong> Moderator board
          </h3>
        </header>
        <p>
          <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p>
        <p>
          <strong>Username:</strong> {currentUser.username}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {/*          {currentUser.roles &&
      currentUser.roles.map((role, index) => <li key={index}>{JSON.stringify(role)}</li>)}*/}
          {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </div>
  <div className="container">
    <QuestionsList  isModerator={true}/>
  </div>
</>

  );
};

export default BoardModerator;
