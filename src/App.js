import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import {Switch, Route, Link, useHistory, NavLink} from "react-router-dom";
/*import "bootstrap/dist/css/bootstrap.min.css";*/
import "./App.css";
import "./components.styling/nav-bar-styling-grid.css";
import "./components.styling/footer-styling-grid.css";
import AuthService from "./services/auth.service";

import { AuthContext } from './context/AuthoritiesContextProvider';
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import SendQuestionFilesInDatabase from "./components/SendQuestionFilesInDatabase";
import EditQuestion from "./components/EditQuestion";
import EditUser from "./components/EditUser";
import FetchQuestionsFilesInDatabase from './components/FetchQuestionsFilesInDatabase';
import Question from './components/Question';
import Painting from './components/Painting';
import QuestionsListDeprecated from './components/QuestionsListDeprecated';
import DownloadFile from './components/DownloadFile';
import AddAnswer from './components/AddAnswer';
import AddPaintingNotMaintainedAnymore from './components/AddPaintingNotMaintainedAnymore';
import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";//I was curious about EventBus design pattern (instead of working with context)
import FilesList from "./components/FilesList";
import Footer from "./components/Footer";
import PaintingsListDeprecated from "./components/PaintingsListDeprecated";
//import DescriptionOld from "./components/DescriptionOld";
import PaintingsListAsTilesWithPagination from "./components/PaintingsListAsTilesWithPagination";
import AddQuestion from "./components/AddQuestion";
//import ConversationOld2 from "./components/ConversationOld2";
import PlayMusicFile from "./components/PlayMusicFile";
import EditProject from "./components/EditProject";
import CSSGridTest1 from "./components/CSSGridTest1";
import CSSGridTest2 from "./components/CSSGridTest2";
import Conversation from "./components/Conversation";
import InitiateProject from "./components/InitiateProject";

const App = () => {
  const [isModerator, setIsModerator] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setIsModerator(user.roles.includes("ROLE_MODERATOR"));
      setIsAdministrator(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
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
          <Route exact path="/fetchQuestionsFilesInDatabase" component={FetchQuestionsFilesInDatabase} />
          <Route exact path="/sendQuestionFilesInDatabase" component={SendQuestionFilesInDatabase} />
          <Route exact path="/questions/:id" component={Question} />
          <Route exact path="/paintings/:id" component={Painting} />
          {/*<Route exact path="/conversationOld2/:id" component={ConversationOld2} />*/}
          {/*<Route exact path="/conversation/:id" component={Conversation} />*/}
          <Route exact path="/edit/question/:id" component={EditQuestion} />
          <Route exact path="/edit/painting/:id" component={EditProject} />
          <Route exact path="/edit/user/:userId" component={EditUser} />
          <Route exact path="/files/:fileId" component={DownloadFile} />
          <Route exact path="/musicFiles/:fileId" component={PlayMusicFile} />
          <Route exact path="/mod" component={BoardModerator} />
          <Route exact path="/admin" component={BoardAdmin} />
          <Route exact path="/add-painting-not-maintained-anymore" component={AddPaintingNotMaintainedAnymore} />
          <Route exact path="/add-question-to-project/:id" component={AddQuestion} />
          <Route exact path="/add-answer/:id" component={AddAnswer} />
          <Route exact path="/question_files_list" component={FilesList} />
          <Route exact path="/paintingsListAsTilesWithPagination" component={PaintingsListAsTilesWithPagination} />
          {/*<Route exact path="/descriptionOld" component={DescriptionOld} />*/}
          <Route exact path="/CSSGridTest1" component={CSSGridTest1} />
          <Route exact path="/CSSGridTest2" component={CSSGridTest2} />
          {/*<Route exact path="/user" component={BoardUser} />*/}
        <Route exact path={["/user"]}
               render={() => <BoardUser isModerator={isModerator}/>
               }/>

          <Route exact path={["/", "/questionsList/users"]}
                 render={() => <QuestionsListDeprecated isModerator={isModerator}/>
                 }/>
          <Route exact path={"/paintingsList/users"}
                 render={() => <PaintingsListDeprecated isModerator={isModerator}/>
                 }/>

        </Switch>
      </div>

      <AuthVerify logout={logOut}/>
{/*      <div className="footer-wrapper">
        <Footer/>
      </div>*/}
      <Footer/>

    </div>
  );
};

export default App;
