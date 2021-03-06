import React, { useState, useEffect,useParam } from "react";
import UserService from "../services/users.data.service";
import AuthService from "../services/auth.service";
import {Link, useHistory, useParams} from "react-router-dom";
import "../components.styling/edit-user-styling-grid.css";
import ListGroup from "react-bootstrap/ListGroup";
const currentUser = AuthService.getCurrentUser();//current user is not the same as user to update!

const EditUser = props => {
    const [userToUpdate, setUserToUpdate] = useState({});
    const [userIsModerator, setUserIsModerator] = useState(false);
    const [userIsAdministrator, setUserIsAdministrator] = useState(false);
    //const [adminCheckbox, setAdminCheckbox] = useState(true );
    //const [modCheckbox, setModCheckbox] = useState(true );
    const [message, setMessage] = useState("");
    const { userId } = useParams();
    const history = useHistory();
    const [submitted, setSubmitted] = useState(false);
    console.log('20 userId',userId)
    console.log('21 userToUpdate.enabled',userToUpdate.enabled)
    console.log('22 userIsModerator',userIsModerator)
    console.log('23 userIsAdministrator',userIsAdministrator)


/*    const administratorCheckbox=()=>{if(userToUpdate.authorities.contains("ROLE_ADMIN")) {
        setCheckAdministrator(true)}
    else{setCheckAdministrator(false)}
    }

    const moderatorCheckbox=()=>{if(userToUpdate.authorities.contains("ROLE_MODERATOR")) {
        setCheckModerator(true)}
    else{setCheckModerator(false)}
    }*/

    const checkIfAdministrator=(authorities)=>{console.log('33 userToUpdate',userToUpdate);
        let isAdministrator=false

        for (const authorityObject of authorities){
            console.log('35 authorityObject',authorityObject);
            if (authorityObject["authority"]=="ROLE_ADMIN"){isAdministrator=true}
        }
        return isAdministrator
    }

    const checkIfModerator=(authorities)=>{console.log('33 userToUpdate',userToUpdate);
        let isModerator=false

        for (const authorityObject of authorities){
            console.log('35 authorityObject',authorityObject);
            if (authorityObject["authority"]=="ROLE_MODERATOR"){isModerator=true}
        }
        return isModerator
    }


    //const administratorCheckbox=()=>{setAdminCheckbox(!adminCheckbox)}
    //const moderatorCheckbox=()=>{setModCheckbox(!modCheckbox)}


    //const handleCheckAdministrator=()=>{console.log('82 updatedUser[moderator]',updatedUser["moderator"])}
    //const handleCheckModerator=()=>{setUpdatedUser({ ...updatedUser, ["administrator"]: true })}

/*    const handleCheckAdministrator = (e) => {
        console.log('101 e.target',e.target)
        const value = e.target.administrator;
        setUpdatedUser({
            ...updatedUser,
            ["roles"]: value
        });
    }*/


    //const fileSelectionHandler = (e) => {setSelectedFiles(selectedFiles => [...selectedFiles, e.target.files[0]]);}

    const handleCheckModerator = (e) => {
        /*setUserIsModerator(!userIsModerator);*/
        if(e.target.checked){/*setUserToUpdate({...userToUpdate,["moderator"]:true});*/
            setUserIsModerator(true);}
        else{setUserIsModerator(false)}
    }
    const handleCheckAdministrator = (e) => {
        /*setUserIsAdministrator(!userIsAdministrator);*/
        if(e.target.checked){/*setUserToUpdate({...userToUpdate,["administrator"]:true});*/
            setUserIsAdministrator(true);}
        else{setUserIsAdministrator(false)}
    }

    const handleCheckEnabled = (e) => {
        /*setUserIsAdministrator(!userIsAdministrator);*/
        if(e.target.checked){setUserToUpdate({...userToUpdate,["administrator"]:true});
            /*setUserIsAdministrator(true);*/}
        else{setUserToUpdate({...userToUpdate,["enabled"]:false});}
    }




/*    const handleCheckModerator = (e) => {
        const value = e.target.moderator;
        setUpdatedUser({
            ...updatedUser,
            [e.target.name]: value
        });
    }*/

    const getUser = id => {
        UserService.get(id)
            .then(response => {
                setUserToUpdate(Object.assign({},  response.data));
                console.log('90 response.data',response.data);
                console.log('91 checkIfModerator(response.data.authorities)',checkIfModerator(response.data.authorities));
                console.log('92 checkIfAdministrator(response.data.authorities)',checkIfAdministrator(response.data.authorities));
                    setUserIsModerator(checkIfModerator(response.data.authorities));
                    setUserIsAdministrator(checkIfAdministrator(response.data.authorities));
                //setUserIsModerator(response.data.authorities.includes("ROLE_MODERATOR"));
                //setUserIsAdministrator(response.data.authorities.includes("ROLE_ADMIN"));
            }
            )
            .catch(e => {
                console.log(e);
            });
    };



    const handleInputChange = event => {
        const { name, value } = event.target;
        setUserToUpdate({ ...setUserToUpdate, [name]: value });
    };


    const updateUser = () => {

        let formData = new FormData()
        console.log('124 userToUpdate',userToUpdate)
        //formData.append('username', userToUpdate.username)
        formData.append('newUsername', userToUpdate.username)
        formData.append('email', userToUpdate.email)
        formData.append('enabled', userToUpdate.enabled)
        formData.append('moderator', userIsModerator)
        formData.append('administrator', userIsAdministrator)

        UserService.update(userToUpdate.username, formData)
            /*.then(response => {
                //setUserToUpdate(response.data);
                console.log('146 response.data',response.data);
                setMessage("User details updated successfully!");
            })
            .catch(e => {
                console.log(e);
            });*/

        if (userIsModerator==true){AuthService.addAuthority = (userToUpdate.username, "ROLE_MODERATOR");}
        if (userIsAdministrator==true){AuthService.addAuthority = (userToUpdate.username, "ROLE_ADMIN")}

    };


    const deleteUser = () => {
        UserService.remove(userToUpdate.username)
            .then(response => {
                console.log(response.data);
                history.push("/admin");
            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        getUser(userId);//here username is used as id
    }, [userId]);


    return (
        <div className="edit-user-container-grid">

            {submitted ? (
                <>

                    <button
                        type="button"
                        className="on-success-back-to-administrator-board"
                        onClick={() => history.push('/admin')}
                    >
                        Back to administrator board
                    </button>

                    <div className="successfully-submitted-message">
                        Project successfully updated!
                    </div>

                </>


            ) : (
                <>
                    <div className="edit-user-form-title">
                        Edit user data
                    </div>
                    <label htmlFor="label-input-user-name" className="label-input-user-name">Username</label>
                    <input
                        type="text"
                        className="input-user-name"
                        id="username"
                        name="username"
                        value={userToUpdate.username}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="label-input-user-email" className="label-input-user-email">Email</label>
                    <input
                        type="text"
                        className="input-user-email"
                        id="email"
                        name="email"
                        value={userToUpdate.email}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="label-input-user-password" className="label-input-user-password">Password</label>
                    <input
                        type="text"
                        className="input-user-password"
                        id="password"
                        name="password"
                        value={userToUpdate.password}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="label-input-user-enabled" className="label-checkbox-user-is-enabled">Enabled</label>
                    <input
                        type="checkbox"
                        className="checkbox-user-is-enabled"
                        value={userToUpdate.enabled}
                        checked={userToUpdate.enabled}
                        //onChange={handleCheckBox}
                        //onChange={setUserToUpdate.enabled=!setUserToUpdate.enabled}
                        onChange={handleCheckEnabled}

                    />

                    <label htmlFor="label-input-user-is-admin" className="label-checkbox-user-is-admin">Administrator privileges granted</label>
                    <input
                        type="checkbox"
                        className="checkbox-user-is-admin"
                        value={userIsAdministrator}
                        checked={userIsAdministrator}
                        //onChange={()=>administratorCheckbox()}
                        onChange={handleCheckAdministrator}
                    />

                    <label htmlFor="label-input-user-is-moderator" className="label-checkbox-user-is-moderator">Moderator privileges granted</label>
                    <input
                        type="checkbox"
                        className="checkbox-user-is-moderator"
                        value={userIsModerator}
                        checked={userIsModerator}
                        //onChange={()=>administratorCheckbox()}
                        onChange={handleCheckModerator}
                    />

                    <button className="delete-user-button" onClick={deleteUser}>
                        Delete user
                    </button>
                    <button className="update-user-button" onClick={updateUser}>
                        Update user
                    </button>
                </>

            )}

        </div>
    );

};

export default EditUser;