import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import "../pages.styling/register-styling.css";
import {useHistory} from "react-router-dom";

import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="filling-form-error-message">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="filling-form-error-message ">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="filling-form-error-message ">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="filling-form-error-message ">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Register = (props) => {
  const form = useRef(); //useRef() does not trigger re-rendering, while updating the state with useState(0 makes the component re-render, see https://dmitripavlutin.com/react-useref-guide/
  const checkBtn = useRef(); //idem
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message)
          setSuccessful(true);
        },
        (error) => {
          setMessage(error.response.data);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="register-container-grid">

        <Form className="form" onSubmit={handleRegister} ref={form}>
          {!successful && (
            <>
              <div  className="label-input-username">Username</div>
              <input
                  type="text"
                  className="input-username"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, username]}
              />


              <div className="label-input-email">Email</div>
              <input
                  type="text"
                  className="input-email"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
              />

              <div className="label-input-password">Password</div>
              <input
                  type="password"
                  className="input-password"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
              />

              <button className="signup-btn">Sign Up</button>
            </>
          )}
          {successful && (
              <>
                <div className="succes-message">
                  You are registered, welcome to Painting Music !
                </div>
                <button
                type="button"
                className="on-success-new-login-button"
                onClick={() => history.push('/login')}
                >
                Login
                </button>
              </>
          )}

         {message && (
             <div
                 className={
                   successful ? "extra-succes-message" : "error-message"
                 }
             >
               {message}
             </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>

    </div>
  );
};

export default Register;
