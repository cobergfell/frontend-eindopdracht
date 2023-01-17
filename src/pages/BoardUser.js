import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import AuthService from "../services/auth.service";
import "../pages.styling/board-user-styling-grid.css";
import ProjectsListAsTiles from "../components/ProjectsListAsTiles";
import {AuthContext} from "../context/AuthoritiesContextProvider";
import Button from "../components/Button";
const currentUser = AuthService.getCurrentUser();

const BoardUser = () => {

    const history = useHistory();

    const contextData = useContext(AuthContext);
    const {setUsername} = contextData;
    const {setIsModerator} = contextData;
    const {setIsAdministrator} = contextData;
    setUsername(currentUser.username)
    if (currentUser.roles.includes("ROLE_ADMIN")) {
        setIsAdministrator(true)
    }
    if (currentUser.roles.includes("ROLE_MODERATOR")) {
        setIsModerator(true)
    }


    return (

        <div className="board-user-container-grid">

            <Button
                className={`btn-basic board-user-new-project-button`}
                disabled={false}
                clickHandler={()  => {history.push('/initiateProject')  }}
                label={`New Project`}
            />

            <div className="container-pages">
                <ProjectsListAsTiles/>
            </div>
        </div>
    )
}

export default BoardUser;
