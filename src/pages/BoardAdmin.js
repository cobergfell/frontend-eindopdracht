import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import "../pages.styling/board-admin-styling-grid.css";
import UsersList from "../components/UsersList";
import UsersService from "../services/users.data.service";
import {useHistory} from "react-router-dom";
import Button from "../components/Button";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const history = useHistory();


  const removeAllUsers = () => {
    UsersService.removeAll()
        .then((response) => {
        })
        .catch((e) => {
          console.log(e);
        });
  };


  return (
      <>
      <div className="board-administrator-container-grid">
        <div className="page-titel">
          <strong>{currentUser.username}</strong> Administration board
        </div>

        <Button
            className={`btn-basic board-admin-home-button`}
            disabled={false}
            clickHandler={() => history.push('/home')}
            label={`Home`}
        />

        <Button
            className={`btn-basic board-admin-remove-all-users-button`}
            disabled={false}
            clickHandler={removeAllUsers}
            label={`Remove All`}
        />

        <div className="users-data-box">
          <UsersList/>
        </div>

      </div>

  </>
  );
};

export default BoardAdmin;
