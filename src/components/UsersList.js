import React, { useState, useEffect, useMemo, useRef } from "react";
import UserDataService from "../services/users.data.service";
import AuthService from "../services/auth.service";
import {useHistory} from "react-router-dom";
import "../components.styling/userList-styling-grid.css";
import UserService from "../services/users.data.service";



const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const usersRef = useRef();
    const history = useHistory();

    usersRef.current = users;

    useEffect(() => {
        retrieveUsers();
    }, []);


    const retrieveUsers = () => {
        UserDataService.getAll()
            .then((response) => {
                setUsers(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveUsers();
    };


    const editUser = (userId) => {
        let path= "/edit/user/" + userId.toString()
        history.push(path);
    };

    const deleteUser = (username) => {
        UserService.remove(username)
            .then(response => {
                history.push("/admin");
            })
            .catch(e => {
                console.log(e);
            });
    };

    const reformatAuthorityName = (authorityName) => {
        if(authorityName=='"ROLE_MODERATOR"'){return "moderator"}
        else if(authorityName=='"ROLE_ADMIN"'){return "administrator"}
        else if(authorityName=='"ROLE_USER"'){return "user"}
        else{return authorityName}
    };

    const writeEnabledStatus = (enabled) => {
        if(enabled==true){return "true"}
        else{return "false"}
    };


    return (<div >
        <table className="display-users-list">
            <thead>
            <tr>
                <th>Username</th>
                <th style={{width: '250px'}}>Email</th>
                <th>Registered on (GMT)</th>
                <th>Last updated on (GMT)</th>
                <th>Authorities</th>
                <th>Enabled</th>
                <th>Action</th>
            </tr>
            </thead>

            <tbody>

            {users.map((user) => (
                <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.dateTimeRegisteredGMT}</td>
                    <td>{user.lastUpdate}</td>
                    <td>
                        <ul className="authorities-list">
                        {user.authorities.map((authorityObj)=> {return (<>
                        <li  className="authorities-item">{reformatAuthorityName(JSON.stringify(authorityObj["authority"]))}
                        </li>
                            </>)})}
                        </ul>
                    </td>

                    <td>{writeEnabledStatus(user.enabled)}</td>
                    <td>
                        <div>
                              <span onClick={() => editUser(user.username)}
                                    className="actions"
                              >
                                <i className="far fa-edit action mr-2">edit/</i>
                              </span>
                            <span onClick={() => deleteUser(user.username)}
                                  className="actions"
                            >
                                <i className="fas fa-trash action">delete</i>
                              </span>
                        </div>

                    </td>
                </tr>
            ))}

            </tbody>
        </table>


    </div>);

};

export default UsersList;