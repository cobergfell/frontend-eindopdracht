import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

import UserService from "../services/user.access.service";
import EventBus from "../common/EventBus";
import "../components.styling/administrator-styling-grid.css";
import UsersList from "./UsersList";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const currentUser = AuthService.getCurrentUser();


  useEffect(() => {
    UserService.getAdminBoard().then(
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
      <>
      <div className="board-administrator-container-grid">
        <div className="page-titel">
          <strong>{currentUser.username}</strong> Administration board
        </div>
{/*        <div className="current-user">
          <strong>{currentUser.username}</strong> Administration board
        </div>*/}
        <div className="user-profile-box">
          {currentUser && (
              <ul className="profile-list">
                <li className="list-item"><strong>Username:</strong> {currentUser.username}</li>
                <li className="list-item"><strong>Email:</strong> {currentUser.email}</li>
                <li className="list-item">
                  <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}</li>
              </ul>
          )}

        </div>


        <div className="users-data-box">
          <UsersList/>
        </div>


        <div className="current-user-test">
          <profile/>
        </div>

{/*        <strong>Authorities:</strong>
        <ul>
          {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>*/}
      </div>

  </>
  );
};

export default BoardAdmin;
