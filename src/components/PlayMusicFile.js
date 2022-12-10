import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import AuthService from "../services/auth.service";
import sound from '../assets/Do_Diese_Mineur_lento.mp3'
import Button from "./Button";
//for audio test
//import { AuthContext } from '../context/AuthContext';

function PlayMusicFile() {
    let history = useHistory()
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    //const {login,logout, user,status} =  useContext(AuthContext);
    const { fileId } = useParams();
    const location = useLocation();
    console.log("14 location",location)
    const myFileName = location.state.fileName;
    //const fileId = location.state.search;
    console.log("17 fileId",fileId)
    console.log("18 myFileName",myFileName)
    console.log("19 error",error)


    const currentUser = AuthService.getCurrentUser();



    let audio = new Audio(sound)//test
    const start = () => {
        audio.play()
    }





    useEffect(()=>{
        async function playFile() {
            setError(false);
            toggleLoading(true);
            const url=`http://localhost:8080/api/user/music-files-database/${fileId}`;
            //const url=`http://localhost:8080/api/user/files_database/1`;
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