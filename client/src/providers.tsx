import React, { FC } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { Provider as StoreProvider } from "react-redux";
import { Router } from "react-router-dom";
import { store } from "store/store";
import { theme } from "components/theme/theme";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export const Providers: FC = ({ children }) => {
  return (
    <Router history={history}>
      <MuiThemeProvider theme={theme}>
        <StoreProvider store={store}>{children}</StoreProvider>
      </MuiThemeProvider>
    </Router>
  );
};
