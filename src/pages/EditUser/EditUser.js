import React, { useState, useEffect,useParam } from "react";
import UserService from "../../services/users.data.service";
import AuthService from "../../services/auth.service";
import {Link, useHistory, useParams} from "react-router-dom";
import "./edit-user.css";
import Button from "../../components/Button/Button";

const currentUser = AuthService.getCurrentUser();//current user is not the same as user to update!


const EditUser =()=> {

    const [userToUpdate, setUserToUpdate] = useState({});
    const [userIsModerator, setUserIsModerator] = useState(false);
    const [userIsAdministrator, setUserIsAdministrator] = useState(false);
    const { userId } = useParams();
    const history = useHistory();
    const [submitted, setSubmitted] = useState(false);


    const checkIfAdministrator=(authorities)=>{
        let isAdministrator=false
        for (const authorityObject of authorities){
            if (authorityObject["authority"]=="ROLE_ADMIN"){isAdministrator=true}
        }
        return isAdministrator
    }

    const checkIfModerator=(authorities)=>{
        let isModerator=false
        for (const authorityObject of authorities){
            if (authorityObject["authority"]=="ROLE_MODERATOR"){isModerator=true}
        }
        return isModerator
    }

    const handleCheckModerator = (e) => {
        if(e.target.checked){
            setUserIsModerator(true);}
        else{setUserIsModerator(false)}
    }
    const handleCheckAdministrator = (e) => {
        if(e.target.checked){
            setUserIsAdministrator(true);}
        else{setUserIsAdministrator(false)}
    }

    const handleCheckEnabled = (e) => {
        if(e.target.checked){setUserToUpdate({...userToUpdate,["administrator"]:true});}
        else{setUserToUpdate({...userToUpdate,["enabled"]:false});}
    }



    const getUser = id => {
        UserService.get(id)
            .then(response => {
                setUserToUpdate(Object.assign({},  response.data));
                    setUserIsModerator(checkIfModerator(response.data.authorities));
                    setUserIsAdministrator(checkIfAdministrator(response.data.authorities));
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
        formData.append('newUsername', userToUpdate.username)
        formData.append('email', userToUpdate.email)
        formData.append('enabled', userToUpdate.enabled)
        formData.append('moderator', userIsModerator)
        formData.append('administrator', userIsAdministrator)

        UserService.update(userToUpdate.username, formData)
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
                    <Button
                        className={`btn-basic edit-user-on-success-back-to-administrator-board-button`}
                        disabled={false}
                        clickHandler={() => history.push('/admin')}
                        label={`Back to administrator board`}
                    />


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
                        onChange={handleCheckEnabled}

                    />

                    <label htmlFor="label-input-user-is-admin" className="label-checkbox-user-is-admin">Administrator privileges granted</label>
                    <input
                        type="checkbox"
                        className="checkbox-user-is-admin"
                        value={userIsAdministrator}
                        checked={userIsAdministrator}
                        onChange={handleCheckAdministrator}
                    />

                    <label htmlFor="label-input-user-is-moderator" className="label-checkbox-user-is-moderator">Moderator privileges granted</label>
                    <input
                        type="checkbox"
                        className="checkbox-user-is-moderator"
                        value={userIsModerator}
                        checked={userIsModerator}
                        onChange={handleCheckModerator}
                    />

                    <Button
                        className={`btn-basic edit-user-delete-user-button`}
                        disabled={false}
                        clickHandler={deleteUser}
                        label={`Delete user`}
                    />

                    <Button
                        className={`btn-basic edit-user-update-user-button`}
                        disabled={false}
                        clickHandler={updateUser}
                        label={`Update user`}
                    />

                </>

            )}

        </div>
    );

};

export default EditUser;