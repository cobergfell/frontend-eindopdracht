import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import AuthService from "../services/auth.service";
import sound from '../assets/Do_Diese_Mineur_lento.mp3'//for audio test
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

/*                    audioControl.src = reReadItem.src;
                    const anchor = document.createElement('a')
                    anchor.href = audioControl.src
                    anchor.download = 'dj3dmix'
                    anchor.click()*/




                });

            } catch (e) {
            }
        }
        playFile();
    },[]);
    return(
        <>


        <div className="download-container">
{/*            <div>
                bla
            </div >
            <div>
                <button onClick={start}>Play</button>
            </div >*/}

            {myFileName!=null &&
                <button className="badge badge-primary mr-2" onClick={()=>{history.push("/paintings/${fileId}")}}>
                    Back to painting
                </button>
            }
            {loading && <p>Loading...</p>}
            {error && <p>`Could not download ${myFileName}`</p>}
        </div>
        </>
    );

}

export default PlayMusicFile;