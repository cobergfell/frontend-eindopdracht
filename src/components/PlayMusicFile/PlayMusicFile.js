import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import AuthService from "../../services/auth.service";
import sound from '../../assets/Do_Diese_Mineur_lento.mp3'
import Button from "../Button/Button";


function PlayMusicFile() {
    let history = useHistory()
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const { fileId } = useParams();
    const location = useLocation();
    const myFileName = location.state.fileName;

    const currentUser = AuthService.getCurrentUser();



    let audio = new Audio(sound)//just for a test
    const start = () => {
        audio.play()
    }





    useEffect(()=>{
        async function playFile() {
            setError(false);
            toggleLoading(true);
            const url=`http://localhost:8080/api/user/music-files-database/${fileId}`;
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
                    link.click();
                    link.remove();
                });

            } catch (e) {
            }
        }
        playFile();
    },[]);
    return(
        <>
        <div className="download-container">

            {myFileName!=null &&
                <Button
                className={`btn-basic play-music-back-to-project-button`}
                disabled={false}
                clickHandler={()=>{history.push("/paintings/${fileId}")}}
                label={`Back to project`}
                />
            }
            {loading && <p>Loading...</p>}
            {error && <p>`Could not download ${myFileName}`</p>}
        </div>
        </>
    );

}

export default PlayMusicFile;