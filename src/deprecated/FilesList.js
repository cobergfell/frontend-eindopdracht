import React, { useState, useEffect, useMemo, useRef } from "react";
import FileService from "../services/file.service";
import { useTable } from "react-table";
import axios from "axios";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import QuestionDataService from "./question.service";
import ListGroup from "react-bootstrap/ListGroup";
const currentUser = AuthService.getCurrentUser();


const FilesList = ({questionFiles}) => {
    //console.log("14 {props: questionFiles} ",{props: questionFiles});
    const [searchTitle, setSearchTitle] = useState("");
    const filesRef = useRef();
    //const [error, setError] = useState(false);
    const history = useHistory();
    //const { questionFiles } = useParams();
    const [files, setFiles] = useState(questionFiles);
    const location = useLocation();
    const MyQuestionFiles = location.state.questionFiles;
    console.log('line 22 MyQuestionFiles',MyQuestionFiles)


    filesRef.current = MyQuestionFiles;

    // useEffect(() => {
    //     retrieveQuestionFiles();
    // }, []);

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };


    // const retrieveQuestionFiles = () => {
    //     FileService.getQuestionFiles()
    //         .then((response) => {
    //             setFiles(response.data);
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         });
    // };

    const retrieveFiles = () => {
        FileService.getAll()
            .then((response) => {
                setFiles(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const refreshList = () => {
        retrieveFiles();
    };

    const removeAllFiles = () => {
        FileService.removeAll()
            .then((response) => {
                console.log(response.data);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };



    const findByTitle = () => {
        FileService.findByTitle(searchTitle)
            .then((response) => {
                setFiles(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };



    const openFile = (rowIndex) => {
        const id = filesRef.current[rowIndex].id;
        history.push("files/" + id);
    };

    const deleteFile = (rowIndex) => {
        const id = filesRef.current[rowIndex].id;

        FileService.remove(id)
            .then((response) => {
                //history.push("files/" + id);
                history.push("files");


                let newFiles = [...filesRef.current];
                newFiles.splice(rowIndex, 1);

                setFiles(newFiles);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };



    const columns = useMemo(
        () => [
            {
                Header: "Id",
                accessor: "id",
            },
            {
                Header: "Name",
                accessor: "name",

                Cell: ({ cell }) => (
                    /*<button value={cell.row.values.name} onClick={props.handleClickGroup}>
                         {cell.row.values.name}
                      </button>*/

/*                    <Link value={cell.row.values.id} to={`files/${cell.row.values.id}`}>
                        {cell.row.values.name}
                        {JSON.stringify(cell.row.values)}
                    </Link>*/

                    <Link value={cell.row.values.id}
                        to={{
                            pathname: `files/${cell.row.values.id}`,
                            //search: attachedFile.fileId,
                            //hash: "",
                            state: { fileName: `${cell.row.values.name}` }
                        }}
                    >
                        {cell.row.values.name}
                        {/*{JSON.stringify(cell.row.values)}*/}
                    </Link>

                )
            },
            {
                Header: "Type",
                accessor: "type",
            },
            {
                Header: "Size",
                accessor: "size",
                Cell: ({ cell }) =>  {
                    const sizeMb = cell.row.values.size/1000;
                    return (
                        <div>
                            <div>
                                <span >
                               {sizeMb.toFixed(2)} kb
                              </span>
                            </div>
                        </div>
                    );
                },


            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    //const rowIdx = parseInt(props.row.id)+1;
                    const rowIdx = props.row.id;
                    console.log("QuestionList line 128 rowIdx ",rowIdx);
                    const rowIdxInteger=parseInt(rowIdx)
                    return (
                        <div>
                            <div>
                                <span onClick={() => deleteFile(rowIdx)}>
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
        data: MyQuestionFiles,
    });

    return (
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
            <div className="col-md-12 list">
                <table
                    className="table table-striped table-bordered"
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

            <div className="col-md-8">
                <button className="badge badge-danger mr-2" onClick={removeAllFiles}>
                    Remove All
                </button>
                <button className="badge badge-primary mr-2" onClick={()=>{history.push("/questionsList")}}>
                    Back to questions
                </button>


            </div>
        </div>
    );
};

export default FilesList;