import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import AuthService from "../services/auth.service";
import "../components.styling/downloadfile-styling.css";
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
    const paintingId = location.state.paintingId;
    //const fileId = location.state.search;
    console.log("fileId",fileId)
    console.log("paintingId",paintingId)
    const currentUser = AuthService.getCurrentUser();


    const goBack = () => {
        history.goBack()
    }

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
                    //history.push(`/paintings/${paintingId}`)
                    //history.push("/paintingsListAsTilesWithPagination")
                    goBack()

                });

            } catch (e) {
            }
        }
        downloadFile();

    },[]);
    return(
        <div className="download-file-container-grid">
            {myFileName &&
            <>
                {/*as alternative to automatically going back you could stay on page until go back button is pushed*/}
                <button className="back-to-project_button" onClick={goBack}>
                    Go back
                </button>


            </>
            }
            {loading && <p>Loading...</p>}
            {error && <p>`Could not download ${myFileName}`</p>}
        </div>

    );

}

export default DownloadFile;