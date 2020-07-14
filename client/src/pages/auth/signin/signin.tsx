import React from "react";
import { makeStyles } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { SignInForm } from "./form";
import { useDispatch } from "react-redux";
import { doLogin } from "store/user/actions";
import { RouteComponentProps, useHistory } from "react-router";
import Socials from "pages/auth/signin/components/socials";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "store/store";
import { UserActions } from "store/user/types";
import { Link } from "react-router-dom";
import { authService } from "services/auth.service";
import { singinValidationSchema } from "./validation";
import { ErrorCodes } from "errors/error-codes";

export const useLoginStyles = makeStyles((theme) => ({
  sectionLayout: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  login: {
    width: "80%",
    [theme.breakpoints.up("sm")]: {
      width: "70%",
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: 500,
    },
  },
  switch: {
    marginTop: theme.spacing(2),
  },
}));

export interface FormValues {
  email: string;
  password: string;
}

export const SignIn = (props: RouteComponentProps) => {
  const classes = useLoginStyles();
  const history = useHistory();
  const dispatch = useDispatch<ThunkDispatch<AppState, void, UserActions>>();
  const initValues: FormValues = {
    email: "",
    password: "",
  };
  const onSumbmit = async (
    values: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>
  ) => {
    try {
      const {
        data: { accessToken, refreshToken },
      } = await authService.login({
        email: values.email,
        password: values.password,
      });
      setSubmitting(false);
      dispatch(doLogin({ accessToken, refreshToken }));
    } catch (error) {
      setSubmitting(false);
      console.error(error);
      if (error.response?.data?.errors) {
        const notActivatedError = error.response?.data?.errors.find(
          (err: { code: ErrorCodes }) => err.code === ErrorCodes.NOT_ACTIVATED
        );
        if (notActivatedError) {
          return history.push("/resend-activation-email", values.email);
        }
        setErrors(
          error.response?.data?.errors.reduce(
            (acc: any, err: { field: string; message: string }) => {
              acc[err.field] = err.message;
              return acc;
            },
            {}
          )
        );
      }
    }
  };
  return (
    <div className={classes.sectionLayout}>
      <section className={classes.login}>
        <Formik
          initialValues={initValues}
          validationSchema={singinValidationSchema}
          onSubmit={onSumbmit}
          component={SignInForm}
        />
        <section className={classes.switch}>
          Forgot password? <Link to="/resetpassword">Reset password</Link>
        </section>
        <Socials />
        <section className={classes.switch}>
          No account yet? <Link to="/signup">Create account</Link>
        </section>
      </section>
    </div>
  );
};
