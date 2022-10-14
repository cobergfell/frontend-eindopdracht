import React, { useState, useRef,useContext } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { AuthContext } from "../context/AuthoritiesContextProvider";
import AuthService from "../services/auth.service";
import "../components.styling/login-styling.css";
import {useHistory} from "react-router-dom";

const required = (value) => {
  if (!value) {
    return (
        <div className="filling-form-error-message">
          This field is required!
        </div>
    );
  }
};

const Login = (props) => {
  const contextData= useContext(AuthContext);
  console.log('27 contextData', contextData);
  const form = useRef();//useRef() does not trigger re-rendering, while updating the state with useState(0 makes the component re-render, see https://dmitripavlutin.com/react-useref-guide/
  const checkBtn = useRef();// idem

  const {username, setUsername} = contextData;
  const {isModerator, setIsModerator} = contextData;
  const {isAdministrator, setIsAdministrator} = contextData;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        () => {
          //props.history.push("/paintingsListAsTilesWithPagination");
          props.history.push("/home");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }



  };

  return (
      <div className="login-container-grid">

        {/*<div className="test1">test</div>*/}
        {/*<img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />*/}

        <Form className="form" onSubmit={handleLogin} ref={form}>

              <>
                {/*<div className="test2">test2</div>*/}
                <div  className="label-input-username">Username</div>
                <input
                    type="text"
                    className="input-username"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                    validations={[required]}
                />


                <div className="label-input-password">Password</div>
                <input
                    type="password"
                    className="input-password"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                    validations={[required]}
                />
                {loading && (
                    <span className="loading-message">loading</span>
                )}
                <button className="login-btn">Login</button>
              </>


          {message && (
              <div className="message">
                {message}
              </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>

      </div>
  );
};

export default Login;
