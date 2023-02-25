import React, { useState, useEffect } from "react";
import {Switch, Route, NavLink} from "react-router-dom";
import "./App.css";
import "./pages/Footer/footer.css";
import AuthService from "./services/auth.service";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import BoardUser from "./pages/Boarduser/BoardUser";
import BoardModerator from "./pages/BoardModerator/BoardModerator";
import BoardAdmin from "./pages/BoardAdmin/BoardAdmin";
import EditUser from "./pages/EditUser/EditUser";
import Painting from './pages/Painting/Painting';
import DownloadFile from './components/DownloadFile/DownloadFile';
import AuthVerify from "./common/AuthVerify";
import Footer from "./pages/Footer/Footer";
import PaintingsList from "./pages/ProjectsList/ProjectsList";
import ProjectsListAsTiles from "./pages/ProjectListAsTiles/ProjectsListAsTiles";
import PlayMusicFile from "./components/PlayMusicFile/PlayMusicFile";
import EditProject from "./pages/EditProject/EditProject";
import InitiateProject from "./pages/InitiateProject/InitiateProject";
import AddReaction from "./components/AddReaction/AddReaction";

const App = () => {
  const [isModerator, setIsModerator] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setIsModerator(user.roles.includes("ROLE_MODERATOR"));
      setIsAdministrator(user.roles.includes("ROLE_ADMIN"));
    }


  }, []);

  const logOut = () => {
    AuthService.logout();
    setIsModerator(false);
    setIsAdministrator(false);
    setCurrentUser(undefined);
  };

  return (
    <div className="app-container">

      <nav className="nav-bar-container-grid">

        <NavLink to={"/"} className="navbar-link brand">
          Painting Music
        </NavLink>


        <NavLink to={"/home"} className="navbar-link home">
          Home
        </NavLink>

            {isModerator && (
                <NavLink to={"/mod"} className="navbar-link moderator">
                  Moderator
                </NavLink>
            )}

            {isAdministrator && (
                <NavLink to={"/admin"} className="navbar-link administrator">
                  Administrator
                </NavLink>
            )}

            {currentUser && (
                <NavLink to={"/user"} className="navbar-link user">
                  Projects
                </NavLink>
            )}

          {currentUser ? (
              <>
                <NavLink to={"/profile"} className="navbar-link profile">
                  {currentUser.username}
                </NavLink>
                <NavLink to={"/home"} className="navbar-link logout" onClick={logOut}>
                  Log out
                </NavLink>

              </>
          ) : (
              <>
              <NavLink to={"/login"} className="navbar-link login">
                Login
              </NavLink>
              <NavLink to={"/register"} className="navbar-link signup">
              Signup
              </NavLink>
              </>
          )}

      </nav>

      <div className="app-body">
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/initiateProject" component={InitiateProject} />
          <Route exact path="/paintings/:id" component={Painting} />
          <Route exact path="/edit/painting/:id" component={EditProject} />
          <Route exact path="/edit/user/:userId" component={EditUser} />
          <Route exact path="/files/:fileId" component={DownloadFile} />
          <Route exact path="/musicFiles/:fileId" component={PlayMusicFile} />
          <Route exact path="/add-reaction/:id" component={AddReaction} />
          <Route exact path="/paintingsListAsTilesWithPagination" component={ProjectsListAsTiles} />
          <Route exact path="/mod" component={BoardModerator} />
          <Route exact path="/admin" component={BoardAdmin} />
          <Route exact path={["/user"]}
               render={() => <BoardUser isModerator={isModerator}/>
               }/>
          <Route exact path={"/paintingsList/users"}
                 render={() => <PaintingsList isModerator={isModerator}/>
                 }/>

        </Switch>
      </div>

      <AuthVerify logout={logOut}/>
      <Footer/>

    </div>
  );
};

export default App;
