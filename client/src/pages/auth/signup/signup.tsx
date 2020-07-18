import React, { useState } from "react";
import { useLoginStyles } from "../signin/signin";
import Socials from "../signin/components/socials";
import { Formik, FormikHelpers } from "formik";
import { SignUpForm } from "./form";
import { authService } from "services/auth.service";
import { Link, RouteComponentProps } from "react-router-dom";
import { signUpSchema } from "./validation";
import { Typography } from "@material-ui/core";

export interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface SubmitStatus {
  error: null | string;
  success: boolean;
}

const SignUp = (props: RouteComponentProps) => {
  const classes = useLoginStyles();
  const [{ success }, setStatus] = useState<SubmitStatus>({
    error: null,
    success: false,
  });
  const initValues: FormValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  };
  const onSumbmit = async (
    values: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>
  ) => {
    try {
      await authService.register({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
      });
      setStatus({ error: null, success: true });
    } catch (error) {
      console.error(error);
      if (error.response?.data?.errors) {
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
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className={classes.sectionLayout}>
      <section className={classes.login}>
        {success && (
          <Typography variant="h4" align="center">
            Successfully registered. Finish registration via letter that has
            been sent to your email
          </Typography>
        )}
        {!success && (
          <>
            <Typography variant="h4" align="center" color="textSecondary">
              Sign up
            </Typography>
            <Formik
              initialValues={initValues}
              onSubmit={onSumbmit}
              validationSchema={signUpSchema}
              component={SignUpForm}
            />
            <Socials signup={true} />
            <section className={classes.switch}>
              Already have an account? <Link to="/signin">Login</Link>
            </section>
          </>
        )}
      </section>
    </div>
  );
};

export default SignUp;
