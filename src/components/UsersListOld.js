import React, { useState, useEffect, useMemo, useRef } from "react";
import UserDataService from "../services/users.data.service";
import { useTable } from "react-table";
import AuthService from "../services/auth.service";
import {Link, useHistory, useParams} from "react-router-dom";
import "../components.styling/userList-styling-grid.css";
//import {useResizeColumns} from "react-table/src/plugin-hooks/useResizeColumns";
//import axios from "axios";
//import EventBus from "../common/EventBus";
//import UserAccessService from "../services/user.access.service";

const currentUser = AuthService.getCurrentUser();


const UsersListOld = (props) => {
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const usersRef = useRef();
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        retrieveUsers();
        console.log('24 users',users)
    }, []);

    usersRef.current = users;
    console.log('27 users',users)

    const onChangeSearchUser = (e) => {
        const searchUser = e.target.value;
        setSearchUser(searchUser);
    };

    const retrieveUsers = () => {
        UserDataService.getAll()
            .then((response) => {
                setUsers(response.data);
                console.log('35 response.data',response.data)
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

    const openUser = (rowIndex) => {
        //const id = usersRef.current[rowIndex].id;
        console.log("74 usersRef.current[rowIndex]",usersRef.current[rowIndex]);
        const id = usersRef.current[rowIndex].username;
        console.log("76 id",id);
        history.push("/edit/user/"+id);
    };

    //const test1 = () => {return 1+1};

    //const test2 = (users) => {if (users) {console.log('81 users.authorities',users.authorities)}}

    const defaultColumn = React.useMemo(
        () => ({
            width: 100,
            minWidth: 50,
            maxWidth: 100
        }),
        []
    );


    const deleteUser = (rowIndex) => {
        //const id = usersRef.current[rowIndex].id;
        const id = usersRef.current[rowIndex].username;
        console.log("87 usersRef.current",usersRef.current)
        console.log("88 usersRef.current[rowIndex].username",usersRef.current[rowIndex].username)
        UserDataService.remove(id)
            .then((response) => {
                props.history.push("/admin");

                let newUsers = [...usersRef.current];
                newUsers.splice(rowIndex, 1);

                setUsers(newUsers);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const columns = useMemo(
        () => [
            {
                Header: "Username",
                accessor: "username",
                //enableResizing: true,
                //size:60,
            },
            {
                Header: "Email",
                accessor: "email",

                // Cell: ({ cell }) => (
                //     <Link value={cell.row.values.username} to={`users/${cell.row.values.email}`}>
                //         {cell.row.values.email}
                //     </Link>)

            },

            {
                Header: "Registered on (GMT)",
                accessor: "dateTimeRegisteredGMT",
            },
            {
                Header: "Modified  on",
                accessor: "lastUpdate",
            },

            {
                Header: "Authorities",
                accessor: "authorities",
                Cell: (props) => {
                    //const rowIdx = parseInt(props.row.id)+1;
                    const rowIdx = props.row.id;
                    console.log("UserList line 135 rowIdx ",rowIdx);
                    const rowIdxInteger=parseInt(rowIdx)
                    return (
                        usersRef.current[rowIdxInteger] && usersRef.current[rowIdxInteger].authorities.map((authority)=>

                        <div style={{ fontSize: 8,
                            fontFamily:"Poppins"
                            }}
                             resize={{
                                 resizerWidth: 5,
                                 resizerHighlight: '#98d8ff',
                             }}

                        >
                            {JSON.stringify(authority.authority)}
                        </div>)
                    );
                },
            },

            {
                Header: "Enabled",
                accessor: "enabled",
                //Cell: (props) => {
                //    return props.value;
                Cell: ({cell}) => (
                    <div style={{ fontSize: 12}}>
                        {JSON.stringify(cell.row.values.enabled)}
                    </div>)
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    //const rowIdx = parseInt(props.row.id)+1;
                    const rowIdx = props.row.id;
                    console.log("UserList line 128 rowIdx ",rowIdx);
                    const rowIdxInteger=parseInt(rowIdx)
                    return (
                        <div>
                            <div>
                              <span onClick={() => openUser(rowIdxInteger)}>
                                <i className="far fa-edit action mr-2">edit</i>
                              </span>
                                <span onClick={() => deleteUser(rowIdx)}>
                                <i className="fas fa-trash action">delete</i>
                              </span>
                            </div>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        //defaultColumn,
        data: users,
        //enableResizing: true,
    }
    //,
    //useResizeColumns,
    );

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by username"
                        value={searchUser}
                        onChange={onChangeSearchUser}
                    />

                </div>
            </div>
            <div className="col-md-12 list">
                <table
                    className="table table-striped table-bordered"
                    {...getTableProps()}
                >
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()} style={{ fontSize: 12}}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        console.log('219 row',row)
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()} style={{ fontSize: 12}}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <button
                className="search-button"
                type="button"
                onClick={findByUsername}
            >
                Search
            </button>
            <button className="remove-all-users-button" onClick={removeAllUsers}>
                Remove All
            </button>
        </div>
    );
};

export default UsersListOld;