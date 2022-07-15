// slightly modified from branch uitwerking-9, repository https://github.com/hogeschoolnovi/frontend-react-user-registration.git
import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
//import { AuthContext } from '../context/AuthContext';
import AuthService from "../services/auth.service";
const currentUser = AuthService.getCurrentUser();

function SendQuestionFilesInDatabase() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    //const {login,logout, user,status} =  useContext(AuthContext);
    const updateTitle = (e) => {setTitle(e.target.value);};
    const updateDescription = (e) => {setContent(e.target.value);};
    const updateTags = (e) => {setTags(e.target.value);};

    //const fileSelectionHandler = (e) => {console.log('e.target.files',e.target.files[0].name);}
    const fileSelectionHandler = (e) => {setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);}
    //const fileSelectionHandler = (e) => {setSelectedFiles([e.target.files[0]]);}

    //const fileSelectionHandler = (e) => {setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files]);}//this attaches no file but no error message is given
    //const fileSelectionHandler = (e) => {setSelectedFiles(e.target.files) }//this attaches only one file


    /*    const fileSelectionHandler = (e) => {
            const value = e.target.files[0];
            setSelectedFiles({
                ...selectedFiles,
                [e.target.name]: value
            });
        }*/


    const uploadFileHandler = async () => {
        try {
            let formData = new FormData()
            formData.append('title', title)
            formData.append('content', content)
            formData.append('tags', tags)
            //formData.append('files', selectedFiles[0],selectedFiles[0].name)
            for (const selectedFile of selectedFiles){
                //formData.append('files',selectedFile,selectedFile.name);
                formData.append('files',selectedFile,selectedFile.name);
            }

            formData.append('username', currentUser.username)

            let url;
            let config;

            if(selectedFiles.length>0){
                url='http://localhost:8080/api/user/questions-upload-with-files-in-database';
                config={headers: {'Content-Type': 'multipart/form-data'
                }}
            } else {
                url='http://localhost:8080/api/user/questions-upload-without-files';
                config={headers: {'Content-Type': 'application/json'}};
            }

            const resp = await axios.post(url, formData,config);

            //const config={headers: {'Content-Type': 'multipart/form-data'}}
            //const res = await axios.post('http://localhost:8080/questions-upload-with-files-in-database', formData,config);
            const res = await axios.post(url, formData,config);
            console.log('line 34 res.data',res.data);
        } catch (err) {
            console.log('line 31 error')
            console.error(err);
        }
    };


    return(
        <form onSubmit={uploadFileHandler}>
            <h2>Question form: </h2>
            <br/>
            <label>Title : </label>
            <input
                type="text"
                placeholder="Title"
                name="title"
                value={title}
                onChange={updateTitle}
            />
            <label>Content : </label>
            <input type="textarea"
                   placeholder="textarea"
                   name="description"
                   value={content}
                   onChange={updateDescription}
            />
            <label>Tags : </label>
            <input
                type="text"
                placeholder="Tags"
                name="tags"
                value={tags}
                onChange={updateTags}
            />


            {/*            <div className="">
                <label>
                    Select Files
                </label>
                <input type="file" name="files" multiple onChange={filesSelectionHandler}/>
                <button type='submit'>Upload</button>
            </div>
            <br/>*/}

            <div className="">
                <label>
                    Select Files:
                </label>
                <input type="file" name="files" multiple onChange={fileSelectionHandler}/>
            </div>
            <button type='submit'>Upload</button>
            <br/>
            <p><strong>Attached files: </strong></p>
            <ul>
                {selectedFiles.map((selectedFile) => {
                    return (
                        <li key={`${selectedFile.name}`}>
                            {selectedFile.name}
                        </li>
                    )
                })}
            </ul>
            {/*            <ul>
                {Object.entries(selectedFiles).map((selectedFile) => {
                    return (
                        <li key={`${selectedFile.name}`}>
                            {selectedFile.name}
                        </li>

                    )
                })}
            </ul>*/}


        </form>
    )
}

export default SendQuestionFilesInDatabase;


/*
        //below an experimental snippet just to keep as idea to retain the dangerouslySetInnerHTML
        // replacing in React the standard innerHTML to prevent cross-site scripting (XSS) attacks
        // see also https://dev.to/jam3/how-to-prevent-xss-attacks-when-using-dangerouslysetinnerhtml-in-react-1464
        const input = document.getElementById('files');
        const  output = document.getElementById('fileList');

        output.dangerouslySetInnerHTML  = '<ul>';
        for (let i = 0; i < input.files.length; ++i) {
            output.dangerouslySetInnerHTML  += '<li>' + input.files.item(i).name + '</li>';
        }
        output.dangerouslySetInnerHTML  += '</ul>';
    }
*/