import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import AuthService from "../services/auth.service";
import "../components.styling/download-styling.css";
//import { AuthContext } from '../context/AuthContext';

function DownloadFile() {
    let history = useHistory()
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status} =  useContext(AuthContext);
    const { fileId } = useParams();
    const location = useLocation();
    console.log("14 location",location)
    const myFileName = location.state.fileName;
    //const fileId = location.state.search;
    console.log("fileId",fileId)
    const currentUser = AuthService.getCurrentUser();


    useEffect(()=>{
        async function downloadFile() {
            setError(false);
            toggleLoading(true);
            const url=`http://localhost:8080/api/user/files-database/${fileId}`;
            //const url=`http://localhost:8080/api/user/files-database/1`;
            console.log("url",url)
            try {
                const result = await axios.get(url, {
                    headers: {
                        'Authorization': `token ${currentUser.accessToken}`
                    },
                    responseType: 'blob',
                }).then(({ data }) => {
                    toggleLoading(false);
                    const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = downloadUrl;

                    //link.setAttribute('download',`${fileName}`);
                    link.download = `${myFileName}`;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                });

            } catch (e) {
            }
        }
        downloadFile();
    },[]);
    return(
        <div className="download-container">
            {myFileName &&
            <>
                {/*<img alt="logo" width="400px" src={logo} />*/}
                {/*<p className="fileName" onClick={()=>DownloadFile(fileName)}>{fileName} </p>*/}

                <button className="badge badge-primary mr-2" onClick={()=>{history.push("/questionsList/users")}}>
                    Back to questions
                </button>

            </>
            }
            {loading && <p>Loading...</p>}
            {error && <p>`Could not download ${myFileName}`</p>}
        </div>

    );

}

export default DownloadFile;