import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { store } from "store/store";
import {
  setReadyForOffline,
  setNewVersionAvailable,
} from "store/tech/tech.actions";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onSuccess: (reg) => {
    // show message: app is ready for offline use
    store.dispatch(setReadyForOffline());
  },
  onUpdate: (reg) => {
    // show message: new version of app is available.
    // Click to reload page and update it now.
    store.dispatch(setNewVersionAvailable());
  },
});
