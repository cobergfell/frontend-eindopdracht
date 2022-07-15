import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthoritiesContextProvider from "./context/AuthoritiesContextProvider";
//import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <AuthoritiesContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthoritiesContextProvider>,
  document.getElementById("root")
);

//serviceWorker.unregister();


