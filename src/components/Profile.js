import React, {useContext} from "react";
import AuthService from "../services/auth.service";
import { AuthContext } from "../context/AuthoritiesContextProvider";
import "../components.styling/profile-styling-grid.css";
import {sortDataBy} from "../services/utilities";
import {Link} from "react-router-dom";

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();
    const contextData = useContext(AuthContext);
    const {username, setUsername} = contextData;
    const {isModerator, setIsModerator} = contextData;
    const {isAdministrator, setIsAdministrator} = contextData;
    setUsername(currentUser.username)
    if (currentUser.roles.includes("ROLE_ADMIN")) {
        setIsAdministrator(true)
    }
    if (currentUser.roles.includes("ROLE_MODERATOR")) {
        setIsModerator(true)
    }
    console.log("75 currentUser.roles.includes(ROLE_ADMIN)", currentUser.roles.includes("ROLE_ADMIN"));
    console.log("75 isModerator", isModerator);
    console.log("76 isAdministrator", isAdministrator);

    return (
        <div className="profile-container-grid">
            <div className="page-title">
                <strong>User profile of</strong>  {currentUser.username}
            </div>
            <div className="user-profile-display-box">
                {currentUser && (
                    <ul className="profile-list">
                        <li className="list-item"><strong>Username:</strong> {currentUser.username}</li>
                        <li className="list-item"><strong>Email:</strong> {currentUser.email}</li>
                        <li className="list-item">
                            <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}</li>
                        <li className="list-item"><strong>Authorities:</strong></li>
                        <ul className="profile-sublist">
                            <li className="list-item"><strong>Basic authority:</strong> true</li>
                            <li className="list-item"><strong>Moderator</strong> {JSON.stringify(isModerator)}</li>
                            <li className="list-item"><strong>Administrator:</strong> {JSON.stringify(isAdministrator)}</li>
                        </ul>
                    </ul>
                )}

            </div>

        </div>
    );
}
export default Profile;
