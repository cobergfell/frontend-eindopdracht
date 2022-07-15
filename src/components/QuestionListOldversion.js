import React, { useState, useEffect, useMemo, useRef } from "react";
import QuestionDataService from "../services/question.service";
import { useTable } from "react-table";
import axios from "axios";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import {Link, useHistory} from "react-router-dom";
const currentUser = AuthService.getCurrentUser();


const QuestionsListOldVersion = (props) => {
    const [questions, setQuestions] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const questionsRef = useRef();
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const history = useHistory();

    questionsRef.current = questions;

    useEffect(() => {
        retrieveQuestions();
    }, []);

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const retrieveQuestions = () => {
        QuestionDataService.getAll()
            .then((response) => {
                setQuestions(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveQuestions();
    };

    const removeAllQuestions = () => {
        QuestionDataService.removeAll()
            .then((response) => {
                console.log(response.data);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByTitle = () => {
        QuestionDataService.findByTitle(searchTitle)
            .then((response) => {
                setQuestions(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const openQuestion = (rowIndex) => {
        const id = questionsRef.current[rowIndex].id;
        props.history.push("edit/question/" + id);
    };

    const deleteQuestion = (rowIndex) => {
        const id = questionsRef.current[rowIndex].id;

        QuestionDataService.remove(id)
            .then((response) => {
                props.history.push("/questions");

                let newQuestions = [...questionsRef.current];
                newQuestions.splice(rowIndex, 1);

                setQuestions(newQuestions);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const columns = useMemo(
        () => [
            {
                Header: "questionId",
                accessor: "questionId",
            },
            {
                Header: "Title",
                accessor: "title",

                Cell: ({ cell }) => (
                    /*                    <button value={cell.row.values.name} onClick={props.handleClickGroup}>
                                            {cell.row.values.name}
                                        </button>*/
                    <Link value={cell.row.values.questionId} to={`/questions/${cell.row.values.questionId}`}>
                        {cell.row.values.title}
                        {JSON.stringify(cell.row.values)}
                    </Link>

                )
            },
            {
                Header: "Sender",
                accessor: "username",
            },
            {
                Header: "Posted on (GMT)",
                accessor: "dateTimePosted (GMT)",
            },
            {
                Header: "Modified  on",
                accessor: "lastUpdate",
            },


            {
                Header: "Status",
                accessor: "open",
                Cell: (props) => {
                    return props.value ? "Open" : "Closed";
                },
            },

            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    //const rowIdx = parseInt(props.row.id)+1;
                    const rowIdx = props.row.id;
                    console.log("QuestionList line 128 props ",props);
                    const rowIdxInteger=parseInt(rowIdx)
                    return (

                        <div>
                            <div>
                              <span onClick={() => openQuestion(rowIdxInteger)}>
                                <i className="far fa-edit action mr-2">edit</i>
                              </span>
                                <span onClick={() => deleteQuestion(rowIdx)}>
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

    let initialState = {}
    if(props.isModerator==false){Object.assign(initialState,{"hiddenColumns":['actions']})}
    console.log('160 initialState',initialState)


    //if you want to extend the list of hidden columns, assign again the entry "hiddenColumns":
    //if(props.isModerator==false){Object.assign(initialState,{"hiddenColumns":['actions','bla']})}
    //console.log('161 initialState',initialState)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,

    } = useTable({
        columns,
        data: questions,
        initialState,
    });

    return (

        <div className="container-items-list">
            <div className="list row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title"
                            value={searchTitle}
                            onChange={onChangeSearchTitle}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={findByTitle}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                <div className="my-col-md-12 list">
                    <table
                        className="my-table table-striped table-bordered"
                        {...getTableProps()}
                    >
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
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
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {console.log('221 props',props)}
                {props.isModerator && (            <div className="col-md-8">
                    <button className="btn btn-sm btn-danger" onClick={removeAllQuestions}>
                        Remove All
                    </button>
                </div>)}
            </div>
        </div>
    );
};

export default QuestionsListOldVersion;