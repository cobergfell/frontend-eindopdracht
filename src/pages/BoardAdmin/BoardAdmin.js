import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import "./board-admin.css";
import UsersList from "../UserList/UsersList";
import UsersService from "../../services/users.data.service";
import {useHistory} from "react-router-dom";
import Button from "../../components/Button/Button";

const BoardAdmin = () => {
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
      <main className="board-administrator-container-grid">
        <h1 className="page-titel">
          <strong>{currentUser.username}</strong> Administration board
        </h1>

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

        <section className="users-data-box">
          <UsersList/>
        </section>

      </main>

  </>
  );
};

export default BoardAdmin;
