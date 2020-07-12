import React, { useEffect, useState } from "react";
import { authService } from "services/auth.service";
import { useDispatch } from "react-redux";
import { Button, Typography, LinearProgress } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { Formik, FormikHelpers, Field } from "formik";
import { object, string, ref } from "yup";
import { TextField } from "formik-material-ui";
import { useLoginStyles } from "../signin/signin";
import { Link } from "react-router-dom";

interface FormValues {
  password: string;
  confirmPassword: string;
}

const validationSchema = object().shape({
  password: string().required().min(8),
  confirmPassword: string()
    .required()
    .oneOf([ref("password")], "Passwords should match"),
});

const ResetPasswordFinished = (props: RouteComponentProps) => {
  const classes = useLoginStyles();
  const [resetData, setResetData] = useState({ email: "", token: "" });
  const [{ success }, setState] = useState({ success: false });
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const email = params.get("email");
    const token = params.get("token");
    if (email && token) {
      setResetData({ email, token });
    } else {
      setError(true);
    }
  }, [dispatch, setResetData, setError]);

  const initValues = {
    password: "",
    confirmPassword: "",
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>
  ) => {
    try {
      await authService.resetPasswordFinish({
        email: resetData.email,
        resetToken: resetData.token,
        newPassword: values.password,
      });
      setState({ success: true });
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
        {error && <Typography>Error occured</Typography>}
        <Typography variant="h4" align="center" color="textSecondary">
          Reset password
        </Typography>
        {success && (
          <Typography variant="h5" align="center">
            Password has been reset. <Link to="/signin">Login</Link>
          </Typography>
        )}
        {!error && !success && (
          <Formik
            validationSchema={validationSchema}
            initialValues={initValues}
            onSubmit={onSubmit}
          >
            {({ submitForm, isSubmitting }) => (
              <>
                <Field
                  component={TextField}
                  name="password"
                  label="Password"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <Field
                  component={TextField}
                  name="confirmPassword"
                  label="Confirm password"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                {isSubmitting && <LinearProgress />}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </>
            )}
          </Formik>
        )}
      </section>
    </div>
  );
};

export default ResetPasswordFinished;
