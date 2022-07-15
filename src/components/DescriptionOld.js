import React, { useState, useEffect, useMemo, useRef } from "react";
import FileService from "../services/file.service";
import { useTable } from "react-table";
import axios from "axios";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import {Link, NavLink,useHistory, useLocation, useParams} from "react-router-dom";
const currentUser = AuthService.getCurrentUser();


const DescriptionOld = () => {
    const history = useHistory();
    const [descriptionState, setDescriptionState] = useState(null);
    const [anotherState, setAnotherState] = useState(null);
    const location = useLocation();
    const paintingId = location.state.paintingId;
    const description = location.state.description;
    console.log('line 22 description',description)
    const onChangeDoSomething = (e) => {
        const anotherState = e.target.value;
        setAnotherState(anotherState);
    };


    return (
        <div className="description-container">

            <div className="my-button-wrapper">

                <button
                    type="button"
                    className="my-primary-button"
                    //onClick={() => history.push(`/add-answer/${painting.paintingId}`)}
                    //onClick={() => history.push(`/add-answer/${question.questionId}`,{"bla": "bla"})}
                    onClick={() => history.push({pathname: `/edit/painting/${location.state.id}`,
                        search: 'bla',
                        hash: '',
                        state: { paintingId: location.state.id,
                                description: location.state.description,
                        },
                        key: ''
                    },)}
                >
                    Edit
                </button>


                <button className="my-primary-button" onClick={()=>{history.push("/user")}}>
                    Back to paintings list
                </button>
            </div>
            <div className="description">
                {description}
            </div>


        </div>
    );
};

export default DescriptionOld;