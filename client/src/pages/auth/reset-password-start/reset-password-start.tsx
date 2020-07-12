import React, { useState } from "react";
import { Formik, Field, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { object, string } from "yup";
import { Button, LinearProgress, Typography } from "@material-ui/core";
import { authService } from "services/auth.service";
import { useLoginStyles } from "../signin/signin";
import { RouteComponentProps } from "react-router";

interface FormValues {
  email: string;
}

const validationSchema = object().shape({
  email: string().required().email(),
});

const ResetPasswordStart = (props: RouteComponentProps) => {
  const classes = useLoginStyles();
  const [{ success }, setState] = useState({ success: false });
  const initValues = {
    email: "",
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>
  ) => {
    try {
      await authService.resetPasswordStart({ email: values.email });
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
    <section className={classes.sectionLayout}>
      <div className={classes.login}>
        <Typography variant="h4" align="center" color="textSecondary">
          Forgot password
        </Typography>
        {success && (
          <Typography variant="h4" align="center">
            We've sent instructions how to reset your password to your email.
            Follow them.
          </Typography>
        )}
        {!success && (
          <Formik
            validationSchema={validationSchema}
            initialValues={initValues}
            onSubmit={onSubmit}
          >
            {({ submitForm, isSubmitting }) => (
              <>
                <Field
                  component={TextField}
                  label="Email"
                  name="email"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                {isSubmitting && <LinearProgress />}
                <Button
                  color="primary"
                  variant="contained"
                  onClick={submitForm}
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </>
            )}
          </Formik>
        )}
      </div>
    </section>
  );
};

export default ResetPasswordStart;
