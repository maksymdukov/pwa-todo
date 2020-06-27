import React from "react";
import { makeStyles } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { SignInForm } from "./form";
import { useDispatch } from "react-redux";
import { login } from "store/user/actions";
import { RouteComponentProps, useHistory } from "react-router";
import Socials from "pages/auth/signin/components/socials";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "store/store";
import { UserActions } from "store/user/types";

const useStyles = makeStyles(theme => ({
  sectionLayout: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  login: {
    width: "80%",
    [theme.breakpoints.up("sm")]: {
      width: "70%"
    },
    [theme.breakpoints.up("md")]: {
      width: "50%"
    },
    [theme.breakpoints.up("lg")]: {
      width: 500
    }
  },
  social: {
    marginTop: theme.spacing(),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  socialIndent: {
    "& > *": {
      marginBottom: theme.spacing()
    }
  }
}));

export interface FormValues {
  email: string;
  password: string;
}

export const SignIn = (props: RouteComponentProps) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, void, UserActions>>();
  const initValues: FormValues = {
    email: "",
    password: ""
  };
  const onSumbmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    dispatch(
      login({
        email: "test@test.com",
        password: "password"
      })
    )
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setSubmitting(false);
      });
  };
  return (
    <div className={classes.sectionLayout}>
      <section className={classes.login}>
        <Formik
          initialValues={initValues}
          onSubmit={onSumbmit}
          component={SignInForm}
        />
        <section className={classes.social}>
          <div className={classes.socialIndent}>
            <Socials />
          </div>
        </section>
      </section>
    </div>
  );
};