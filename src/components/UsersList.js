import React, { useState, useEffect, useMemo, useRef } from "react";
import UserDataService from "../services/users.data.service";
//import { useTable } from "react-table";
import AuthService from "../services/auth.service";
import {Link, useHistory, useParams} from "react-router-dom";
import "../components.styling/userList-styling-grid.css";
import UserService from "../services/users.data.service";
//import {useResizeColumns} from "react-table/src/plugin-hooks/useResizeColumns";
//import axios from "axios";
//import EventBus from "../common/EventBus";
//import UserAccessService from "../services/user.access.service";

const currentUser = AuthService.getCurrentUser();


const UsersList = (props) => {
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const usersRef = useRef();
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const history = useHistory();

    usersRef.current = users;

    useEffect(() => {
        retrieveUsers();
    }, []);

    const onChangeSearchUser = (e) => {
        const searchTitle = e.target.value;
        setSearchUser(searchUser);
    };

    const retrieveUsers = () => {
        UserDataService.getAll()
            .then((response) => {
                console.log('34 response.data',response.data);
                setUsers(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveUsers();
    };

    const removeAllUsers = () => {
        UserDataService.removeAll()
            .then((response) => {
                console.log(response.data);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByUsername = () => {
        UserDataService.findByUsername(searchUser)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const editUser = (userId) => {
        let path= "/edit/user/" + userId.toString()
        console.log("72 userId",userId);
        console.log("73 path",path);
        history.push(path);
    };

    const deleteUser = (username) => {
        UserService.remove(username)
            .then(response => {
                console.log(response.data);
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

        {/*        (users===undefined) &&
       ( <p>JSON.stringify({users}): {JSON.stringify({users})}</p>)*/}
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
                {/*<th>JSON.stringify(user)</th>*/}
            </tr>
            </thead>

            <tbody>

            {users.map((user) => (
                <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.dateTimeRegisteredGMT}</td>
                    <td>{user.lastUpdate}</td>
                    {/*<td>{JSON.stringify(user.authorities)}</td>*/}
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
                            <span onClick={() => deleteUser(user.userId)}
                                  className="actions"
                            >
                                <i className="fas fa-trash action">delete</i>
                              </span>
                        </div>

                    </td>
                    {/*<td>{JSON.stringify({user})}</td>*/}

                </tr>
            ))}

            </tbody>
        </table>


    </div>);

};

export default UsersList;