import React, { useState, useRef,useContext } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { AuthContext } from "../../context/AuthoritiesContextProvider";
import AuthService from "../../services/auth.service";
import "./login.css";

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
  console.log('22 contextData', contextData);
  console.log('23 props', props);

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

    //console.log("Firing");// for test purpose
    console.warn('my error');
    e.preventDefault(); //see https://www.w3schools.com/jsref/event_preventdefault.asp

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
      <main className="login-container-grid">

        <Form className="form" onSubmit={handleLogin} ref={form}>

          <>
            <h3  className="label-input-username">Username</h3>
            <input
                type="text"
                className="input-username"
                name="username"
                value={username}
                onChange={onChangeUsername}
                validations={[required]}
                label="username"
                aria-label="username"
            />


            <h3 className="label-input-password">Password</h3>
            <input
                type="text"
                className="input-password"
                name="password"
                value={password}
                onChange={onChangePassword}
                validations={[required]}
                label="password"
                aria-label="password"
            />
            {loading && (
                <span className="loading-message">loading</span>
            )}
            <button className="login-btn" name="login-button">Login</button>

          </>

          {message && (
              <div className="message">
                {message}
              </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>

      </main>
  );
};

export default Login;
