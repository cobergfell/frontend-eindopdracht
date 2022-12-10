// Pagination client side is based on based on https://academind.com/tutorials/reactjs-pagination

import React, { useState, useEffect,useContext } from 'react';
import "../pages.styling/pagination-styling.css";
import axios from 'axios';
import {Link, NavLink, useHistory, useLocation, useParams} from 'react-router-dom';
import AuthService from "../services/auth.service";
import DownloadFile from "./DownloadFile";
//import { AuthContext } from '../context/AuthContext';


function Pagination({ data, RenderComponent, title, pageLimit, dataLimit}) {
    const [pages] = useState(Math.round(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    function goToNextPage() {
        setCurrentPage((page) => page + 1);
        console.log('17 currentPage',currentPage);
    }

    function goToPreviousPage() {
        setCurrentPage((page) => page - 1);
        console.log('22 currentPage',currentPage);
    }

    function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
        console.log('28 currentPage',currentPage);
    }

    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        console.log('34 data.slice(startIndex, endIndex);',data.slice(startIndex, endIndex))
        return data.slice(startIndex, endIndex);
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <div className="pagination-container">
            <div className="painting-tiles">
                {/*<p>{JSON.stringify(getPaginatedData())}</p>*/}
                {getPaginatedData().map((d, idx) => (
                    <>
                   {/*<RenderComponent key={idx} dataObject={d} isModerator={isModerator}/>*/}
                   <RenderComponent key={idx} dataObject={d}/>
                    </>
                ))}
            </div>
            <div className="my-pagination">
                {/* previous button */}
                <button
                    onClick={goToPreviousPage}
                    className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    prev
                </button>

                {/* show page numbers */}
                {getPaginationGroup().map((item, index) => (
                    <button
                        key={index}
                        onClick={changePage}
                        className={`paginationItem ${currentPage === item ? 'active' : null}`}
                    >
                        <span>{item}</span>
                    </button>
                ))}

                <button
                    onClick={goToNextPage}
                    className={`next ${currentPage === pages ? 'disabled' : ''}`}
                >
                    next
                </button>
            </div>
        </div>
);
}

export default Pagination;