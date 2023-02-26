import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import AuthService from "../../services/auth.service";
import "./board-user.css";
import ProjectsListAsTiles from "../ProjectListAsTiles/ProjectsListAsTiles";
import {AuthContext} from "../../context/AuthoritiesContextProvider";
import Button from "../../components/Button/Button";
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

        <main className="board-user-container-grid">


            <Button
                className={`btn-basic new-project-button`}
                disabled={false}
                clickHandler={()  => {history.push('/initiateProject')  }}
                label={`New Project`}
            />

            <section className="container-pages">
                <ProjectsListAsTiles/>
            </section>
        </main>
    )
}

export default BoardUser;
