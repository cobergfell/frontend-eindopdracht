import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

import UserService from "../services/user.access.service-DEPRECATED";
import EventBus from "../common/EventBus";
import "../components.styling/board-admin-styling-grid.css";
import UsersList from "./UsersList";
import UsersService from "../services/users.data.service";
import {useHistory} from "react-router-dom";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const history = useHistory();


  const removeAllUsers = () => {
    UsersService.removeAll()
        .then((response) => {
          console.log('21 response.data',response.data);
        })
        .catch((e) => {
          console.log(e);
        });
  };


/*  useEffect(() => {
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
  }, []);*/


  return (
      <>
      <div className="board-administrator-container-grid">
        <div className="page-titel">
          <strong>{currentUser.username}</strong> Administration board
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
            onClick={removeAllUsers}
        >
          Remove All
        </button>

        <div className="users-data-box">
          <UsersList/>
        </div>

        {/*<div className="user-profile-box">
          {currentUser && (
              <ul className="profile-list">
                <li className="list-item"><strong>Username:</strong> {currentUser.username}</li>
                <li className="list-item"><strong>Email:</strong> {currentUser.email}</li>
                <li className="list-item">
                  <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}</li>
              </ul>
          )}

        </div>*/}


{/*        <div className="current-user-test">
          <profile/>
        </div>*/}

      </div>

  </>
  );
};

export default BoardAdmin;
