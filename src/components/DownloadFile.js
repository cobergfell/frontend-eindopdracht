import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import AuthService from "../services/auth.service";
import "../components.styling/downloadfile-styling.css";
import Button from "../components/Button";

function DownloadFile() {
    let history = useHistory()
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const { fileId } = useParams();
    const location = useLocation();
    const myFileName = location.state.fileName;
    const paintingId = location.state.paintingId;
    const currentUser = AuthService.getCurrentUser();


    const goBack = () => {
        history.goBack()
    }

    useEffect(()=>{
        async function downloadFile() {
            setError(false);
            toggleLoading(true);
            const url=`http://localhost:8080/filesInDatabase/${fileId}`;
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
                    link.download = `${myFileName}`;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
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
                <Button
                    className={`btn-basic download-file-back-to-project-button`}
                    disabled={false}
                    clickHandler={goBack}
                    label={`Go back`}
                />


            </>
            }
            {loading && <p>Loading...</p>}
            {error && <p>`Could not download ${myFileName}`</p>}
        </div>

    );

}

export default DownloadFile;