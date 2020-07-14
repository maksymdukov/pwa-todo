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

const ResendActivationEmail = (props: RouteComponentProps) => {
  const classes = useLoginStyles();
  const routeState = props.history.location.state;
  const [{ success }, setState] = useState({ success: false });
  const initValues = {
    email: (typeof routeState === "string" && routeState) || "",
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>
  ) => {
    try {
      await authService.resendEmailActivation(values.email);
      setSubmitting(false);
      setState({ success: true });
    } catch (error) {
      setSubmitting(false);
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
    }
  };
  return (
    <section className={classes.sectionLayout}>
      <div className={classes.login}>
        <Typography variant="h4" align="center" color="textSecondary">
          Resend email activation
        </Typography>
        {success && (
          <Typography variant="h4" align="center">
            We've sent instructions how to activate your account. Follow them.
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

export default ResendActivationEmail;
