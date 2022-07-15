import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory,useParams} from 'react-router-dom';
import {sortDataBy} from "../services/utilities";
import PaintingDataService from "../services/painting.service";
//import { AuthContext } from '../context/AuthContext';
import DownloadFile from "./DownloadFile";
import AuthService from "../services/auth.service";


const currentUser = AuthService.getCurrentUser();


function TestComponent() {



    return (
        <div>
            test
        </div>


    );

}

export default TestComponent;